
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isRateLimited } from '../../utils/email/rateLimitDetection';

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      console.log("Requesting password reset for:", email);
      
      // Get the current domain for redirect
      const origin = window.location.origin;
      
      // Build the full redirect URL with path that matches your application router
      const redirectTo = `${origin}/auth/reset-password`;
      
      console.log("Using redirect URL:", redirectTo);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });
      
      if (error) {
        console.error("Password reset error:", error);
        
        // Use the improved rate limit detection
        if (isRateLimited(error.message)) {
          // Don't throw the error, instead show a user-friendly message
          toast({
            title: "Please wait a moment",
            description: "You've recently requested a password reset. Please check your email or wait a few minutes before trying again.",
            duration: 8000,
          });
          return false;
        }
        
        // Check for specific types of errors
        if (error.message?.includes("sending email") || error.message?.includes("smtp") || error.message?.includes("host")) {
          toast({
            title: "Email service issue",
            description: "We're having trouble sending emails right now. Please try again later or contact support if the problem persists.",
            duration: 8000,
            variant: "destructive", 
          });
          return false;
        }
        
        throw error;
      }
      
      console.log("Password reset email sent successfully");
      toast({
        title: "Email sent",
        description: "Check your inbox for password reset instructions. If you don't see it, check your spam folder.",
        duration: 6000,
      });
      
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Default error handling
      toast({
        title: "Reset request failed",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
};
