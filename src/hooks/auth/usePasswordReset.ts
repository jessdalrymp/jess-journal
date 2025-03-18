
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
};
