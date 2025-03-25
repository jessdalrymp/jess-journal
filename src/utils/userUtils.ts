
import { supabase } from '../integrations/supabase/client';

/**
 * Ensures a user exists in both auth and the profiles table.
 * If the user doesn't exist, creates a new user.
 * 
 * @param email User email
 * @param password User password
 * @param name Optional user name
 * @param skipEmailVerification If true, won't wait for email verification (development only)
 * @returns Object containing success status and user info
 */
export const ensureUserExists = async (
  email: string, 
  password: string, 
  name?: string,
  skipEmailVerification = false
) => {
  try {
    // Check if user exists in the profiles table
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking if user exists:', fetchError);
      return { success: false, error: fetchError };
    }

    // User exists, return success
    if (existingUser) {
      console.log('User already exists:', existingUser.id);
      return { success: true, exists: true, user: existingUser };
    }

    // User doesn't exist, create a new one
    console.log('Creating new user:', email);
    
    // Sign up the user with Supabase Auth - this handles password hashing automatically
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name: name || email.split('@')[0],
          isNewUser: true
        },
        // Send email verification
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (signUpError) {
      console.error('Error creating user:', signUpError);
      return { success: false, error: signUpError };
    }

    if (!data.user) {
      console.error('No user returned after signup');
      return { success: false, error: 'No user created' };
    }

    console.log('Auth user created successfully:', data.user.id);

    // For development environments, we can optionally skip email verification
    if (skipEmailVerification && 
        (window.location.origin.includes('localhost') || 
         window.location.origin.includes('127.0.0.1'))) {
      console.log('Skipping email verification in development');
      
      // When skipping email verification, we need to manually ensure the profile exists
      // Note that the auth.users trigger should handle this automatically, but we're being explicit here
      const { error: insertError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email: email,
        created_at: new Date().toISOString(),
        assessment_completed: false
      });
      
      if (insertError) {
        console.error('Error inserting user data:', insertError);
        return { success: false, error: insertError };
      }
    }

    return { 
      success: true, 
      user: data.user,
      emailVerificationRequired: !data.session,
      created: true 
    };
  } catch (error) {
    console.error('Exception in ensureUserExists:', error);
    return { success: false, error };
  }
};
