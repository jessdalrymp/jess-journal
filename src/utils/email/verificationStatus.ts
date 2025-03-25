
import { supabase } from '../../integrations/supabase/client';

/**
 * Helper function to check if a user's email is verified
 * 
 * @param email User's email address
 * @returns Promise resolving to boolean indicating if email is verified
 */
export const checkEmailVerification = async (email: string): Promise<boolean> => {
  try {
    // Get user details by email - this only works for the current user
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      console.log("No current user or error getting user:", error);
      return false;
    }
    
    // If the user's email doesn't match the one we're checking, return false
    if (data.user.email !== email) {
      console.log("Current user email doesn't match the one being checked");
      return false;
    }
    
    // Check if email is confirmed
    const isVerified = data.user.email_confirmed_at != null;
    console.log("Email verification status for", email, ":", isVerified);
    
    return isVerified;
  } catch (error) {
    console.error("Error checking email verification:", error);
    return false;
  }
};
