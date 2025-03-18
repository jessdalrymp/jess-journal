
import { useState, useEffect } from 'react';
import { supabase } from "../../../integrations/supabase/client";

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('check_is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      }
      
      setIsAdmin(data === true);
      return data === true;
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  return {
    isAdmin,
    loading,
    checkAdminStatus
  };
};
