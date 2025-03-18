
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';

export const useAuthCallback = () => {
  const [loading, setLoading] = useState(false);

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

  return { handleAuthCallback, loading };
};
