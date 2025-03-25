
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
    console.log('=== Starting ensureUserExists ===');
    console.log('Checking if user exists:', email);
    
    // Check if user exists in the profiles table
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking if user exists:', fetchError);
      console.error('Error details:', JSON.stringify(fetchError, null, 2));
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
      console.error('Error details:', JSON.stringify(signUpError, null, 2));
      console.error('Error code:', signUpError.code);
      console.error('Error message:', signUpError.message);
      return { success: false, error: signUpError };
    }

    if (!data.user) {
      console.error('No user returned after signup');
      return { success: false, error: 'No user created' };
    }

    console.log('Auth user created successfully:', data.user.id);
    console.log('User data:', JSON.stringify(data.user, null, 2));

    // For development environments, we can optionally skip email verification
    if (skipEmailVerification && 
        (window.location.origin.includes('localhost') || 
         window.location.origin.includes('127.0.0.1'))) {
      console.log('Skipping email verification in development');
      
      // When skipping email verification, we need to manually ensure the profile exists
      // Note that the auth.users trigger should handle this automatically, but we're being explicit here
      console.log('Manually creating profile for user:', data.user.id);
      const { error: insertError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email: email,
        created_at: new Date().toISOString(),
        assessment_completed: false
      });
      
      if (insertError) {
        console.error('Error inserting user data:', insertError);
        console.error('Error details:', JSON.stringify(insertError, null, 2));
        console.error('Error code:', insertError.code);
        console.error('Error message:', insertError.message);
        return { success: false, error: insertError };
      }
      
      console.log('Profile created successfully for user:', data.user.id);
    } else {
      console.log('Email verification required, profile will be created after verification');
    }

    console.log('=== Completed ensureUserExists ===');
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
