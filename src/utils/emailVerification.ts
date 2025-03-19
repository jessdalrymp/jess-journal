
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

/**
 * Sends a custom verification email using the Supabase Edge Function
 * 
 * @param email Email address to send verification to
 * @returns Promise resolving to boolean indicating success
 */
export const sendCustomVerificationEmail = async (email: string): Promise<boolean> => {
  try {
    // Get the domain origin
    const origin = window.location.origin;
    
    // Construct the verification URL
    const verificationUrl = `${origin}/auth/callback?signUpEmail=${encodeURIComponent(email)}`;
    
    console.log("Sending verification email to:", email);
    console.log("Verification URL:", verificationUrl);
    
    // First, try to use built-in Supabase auth email functionality
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: verificationUrl,
        }
      });
      
      if (!resendError) {
        console.log("Successfully sent verification email using Supabase auth.resend");
        return true;
      }
      
      console.warn("Supabase resend failed, falling back to custom function:", resendError);
    } catch (resendError) {
      console.warn("Exception in Supabase resend, falling back to custom function:", resendError);
    }
    
    // If Supabase email fails, fall back to our custom email function
    // Get the Supabase project URL - use full URL to avoid CORS issues
    const supabaseProjectUrl = 'https://uobvlrobwohdlfbhniho.supabase.co';
    
    // Construct the edge function URL
    const functionEndpoint = '/functions/v1/send-verification-email';
    const functionUrl = `${supabaseProjectUrl}${functionEndpoint}`;
    
    console.log("Calling verification email function at:", functionUrl);
    
    // Get the session token for authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    
    // If we don't have a session, use the public anon key from the environment
    const authHeader = accessToken 
      ? `Bearer ${accessToken}` 
      : `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`;
    
    console.log("Using auth header:", authHeader ? "Bearer token present" : "No bearer token");
    
    // Make the request with authorization headers
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        email,
        verificationUrl,
        retryCount: 0 // Adding retry count for tracking retries
      })
    });
    
    // Check for network failures
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Network error (${response.status}): ${errorText}`);
      
      // If this is the first attempt and we got a 500 error, try again with text-only email format
      if (response.status === 500) {
        console.log("Attempting to retry with text-only format...");
        
        const retryResponse = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            email,
            verificationUrl,
            useTextOnly: true,
            retryCount: 1
          })
        });
        
        if (retryResponse.ok) {
          console.log("Retry with text-only format successful");
          return true;
        }
        
        console.error("Retry also failed");
      }
      
      return false;
    }
    
    // Parse the response
    let responseData;
    try {
      responseData = await response.json();
      console.log("Verification email API response:", responseData);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      return false;
    }
    
    if (!responseData.success) {
      console.error('Error in verification email response:', responseData.error);
      return false;
    }
    
    console.log("Verification email sent successfully via custom function");
    return true;
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    console.error('Error details:', error.stack || 'No stack trace available');
    return false;
  }
};

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
