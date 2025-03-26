
import { supabase } from '../../../integrations/supabase/client';

/**
 * Checks if a user with the provided email already exists
 * @param email The email to check
 * @returns Promise resolving to boolean indicating if user exists
 */
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    console.log("Checking if user exists:", email);
    
    // First try profiles lookup as it's more reliable
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error("Error checking if user exists in profiles:", error);
    }
    
    if (data) {
      console.log("User exists in profiles:", data.id);
      return true;
    }

    // Try auth lookup as fallback using a different approach
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false // Only check if user exists, don't create
        }
      });
      
      // If there's no error with code 'user_not_found', the user likely exists
      if (!signInError || !signInError.message.includes('user_not_found')) {
        console.log("User likely exists in auth system");
        return true;
      }
    } catch (e) {
      console.log("Error checking auth system:", e);
      // Ignore errors here, we're just doing a check
    }

    console.log("User does not appear to exist");
    return false;
  } catch (error) {
    console.error("Exception checking if user exists:", error);
    return false;
  }
};
