
import { supabase } from '../integrations/supabase/client';

/**
 * Ensures a user exists in both auth and the users table.
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
    // Check if user exists in the users table
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
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
    
    // Sign up the user with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name: name || email.split('@')[0],
          isNewUser: true
        },
        // In development, you might want to disable email verification
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

    // If skipEmailVerification is true and we're in development
    if (skipEmailVerification && 
        (window.location.origin.includes('localhost') || 
         window.location.origin.includes('127.0.0.1'))) {
      console.log('Skipping email verification in development');
      
      // Create a record in the users table
      const { error: insertError } = await supabase.from('users').upsert({
        id: data.user.id,
        email: email,
        name: name || email.split('@')[0],
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
