
import { supabase } from '../../../integrations/supabase/client';

/**
 * Helper to handle email verification requirements
 * @param origin The current site origin for redirects
 * @param email The user's email address
 * @returns Promise resolving to boolean indicating if email was sent
 */
export const sendVerificationEmail = async (origin: string, email: string): Promise<boolean> => {
  try {
    console.log("Sending verification email to:", email);
    console.log("Verification redirect URL:", `${origin}/auth/callback`);
    
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      }
    });
    
    if (resendError) {
      console.error("Error sending verification email:", resendError);
      return false;
    }
    
    console.log("Verification email sent successfully");
    return true;
  } catch (error) {
    console.error("Exception sending verification email:", error);
    return false;
  }
};
