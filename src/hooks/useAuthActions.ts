
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
      
      // Get the current origin (domain) to use for redirection
      const origin = window.location.origin;
      console.log("Current origin for redirects:", origin);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            isNewUser: true // Add flag to identify new users
          },
          emailRedirectTo: `${origin}/auth/callback`
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
          title: "Almost there!",
          description: "Please check your email to verify your account. If you don't see it, check your spam folder.",
          duration: 6000,
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

  // Add a handler for OAuth callbacks
  const handleAuthCallback = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error);
        throw error;
      }
      
      if (data?.session) {
        console.log("User authenticated from OAuth callback");
        return data.session;
      }
      
      return null;
    } catch (error) {
      console.error("Error handling auth callback:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    signIn, 
    signUp, 
    signOut, 
    resetPassword, 
    handleAuthCallback,
    loading 
  };
};
