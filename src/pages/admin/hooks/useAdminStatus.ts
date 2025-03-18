
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "../../../integrations/supabase/client";
import { useToast } from "../../../hooks/use-toast";

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkAdminStatus = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('check_is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Admin check failed",
          description: error.message,
          variant: "destructive"
        });
        setIsAdmin(false);
        return false;
      }
      
      setIsAdmin(data === true);
      return data === true;
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      toast({
        title: "Admin check failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
      setIsAdmin(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  const makeAdmin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('make_user_admin');
      
      if (error) {
        console.error("Error making admin:", error);
        toast({
          title: "Error",
          description: "Failed to set admin role. " + error.message,
          variant: "destructive"
        });
        return false;
      }
      
      if (data === true) {
        setIsAdmin(true);
        toast({
          title: "Success",
          description: "You are now an administrator",
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Error making admin:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isAdmin,
    loading,
    checkAdminStatus,
    makeAdmin
  };
};
