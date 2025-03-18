
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSignIn = () => {
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

  return { signIn, loading };
};
