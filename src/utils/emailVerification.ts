
import { useToast } from '@/hooks/use-toast';

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
    
    // Get the Supabase project URL - use full URL to avoid CORS issues
    const supabaseProjectUrl = 'https://uobvlrobwohdlfbhniho.supabase.co';
    
    // Construct the edge function URL
    const functionEndpoint = '/functions/v1/send-verification-email';
    const functionUrl = `${supabaseProjectUrl}${functionEndpoint}`;
    
    console.log("Calling verification email function at:", functionUrl);
    
    // Make the request with authorization headers
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // This is the anonymous key, it's safe to include here
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYnZscm9id29oZGxmYmhuaWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4Mzg4MjcsImV4cCI6MjA1NTQxNDgyN30.72SrWrfSrHhZ_hCcj5slTml4BABh-z_du8v9LGI8bsc`
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
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYnZscm9id29oZGxmYmhuaWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4Mzg4MjcsImV4cCI6MjA1NTQxNDgyN30.72SrWrfSrHhZ_hCcj5slTml4BABh-z_du8v9LGI8bsc`
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
