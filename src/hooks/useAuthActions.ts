import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Signing in with:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Authentication error:", error);
        throw error;
      }

      console.log("Sign-in successful response:", data);
      
      if (data?.user) {
        console.log("Sign-in successful for user:", data.user.id);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        return data;
      } else {
        console.error("No user returned after sign in");
        throw new Error("Authentication failed. Please try again.");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      console.log("Signing up with:", email, name);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Sign-up response:", data);
      
      if (data?.session) {
        console.log("Sign-up successful with session:", data.user?.id);
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
        return data;
      } else if (data?.user) {
        console.log("Sign-up requires email verification:", data.user.id);
        toast({
          title: "Verification required",
          description: "Please check your email to verify your account.",
        });
        return data;
      } else {
        console.error("No user or session returned after sign up");
        throw new Error("Account creation failed. Please try again.");
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out");
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Signout error:", error);
        throw error;
      }
      
      console.log("Sign-out successful");
      toast({
        title: "Signed out",
        description: "You've been successfully logged out.",
      });
    } catch (error) {
      console.error('Signout error:', error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      console.log("Requesting password reset for:", email);
      
      // Set the redirect URL to the deployed site URL
      const redirectUrl = 'https://www.jess-journal.com/auth/reset-password';
      
      console.log("Using redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        console.error("Password reset error:", error);
        throw error;
      }
      
      console.log("Password reset email sent successfully");
      toast({
        title: "Email sent",
        description: "Check your inbox for password reset instructions.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, signUp, signOut, resetPassword, loading };
};
