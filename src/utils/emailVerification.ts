
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
    console.log("======= VERIFICATION EMAIL PROCESS STARTING =======");
    // Get the domain origin
    const origin = window.location.origin;
    
    // Construct the verification URL
    const verificationUrl = `${origin}/auth/callback?signUpEmail=${encodeURIComponent(email)}`;
    
    console.log("Sending verification email to:", email);
    console.log("Verification URL:", verificationUrl);
    
    // Get the Supabase project URL
    const supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uobvlrobwohdlfbhniho.supabase.co';
    
    // Construct the edge function URL
    const functionEndpoint = '/functions/v1/send-verification-email';
    const functionUrl = `${supabaseProjectUrl}${functionEndpoint}`;
    
    console.log("Calling verification email function at:", functionUrl);
    
    // Get the session token for authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Prepare authentication header
    let authHeader = '';
    if (accessToken) {
      console.log("Using access token for auth");
      authHeader = `Bearer ${accessToken}`;
    } else if (anonKey) {
      console.log("Using anon key for auth (fallback)");
      authHeader = `Bearer ${anonKey}`;
    } else {
      console.error("No authentication method available");
      return false;
    }
    
    console.log("Auth header type:", authHeader ? "Bearer token present" : "No bearer token");
    
    // Prepare the request body
    const requestBody = JSON.stringify({
      email,
      verificationUrl,
      retryCount: 0
    });
    
    console.log("Request body:", requestBody);
    
    // Make the request with authorization headers
    console.log("Sending request to edge function...");
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: requestBody
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
          const responseData = await retryResponse.json();
          console.log("Response data:", responseData);
          return true;
        }
        
        console.error("Retry also failed");
        try {
          const retryErrorText = await retryResponse.text();
          console.error("Retry error details:", retryErrorText);
        } catch (e) {
          console.error("Could not extract retry error details");
        }
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
    console.log("======= VERIFICATION EMAIL PROCESS COMPLETED SUCCESSFULLY =======");
    return true;
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    console.error('Error details:', error.stack || 'No stack trace available');
    console.log("======= VERIFICATION EMAIL PROCESS FAILED =======");
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
