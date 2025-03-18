
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSignOut = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  return { signOut, loading };
};
