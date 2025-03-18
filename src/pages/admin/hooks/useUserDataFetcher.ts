
import { useState, useCallback } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import { useToast } from '../../../hooks/use-toast';

interface User {
  id: string;
  email: string;
  created_at: string;
  profile_data: any;
  subscription_data: any;
  is_admin: boolean;
}

export const useUserDataFetcher = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Make a type-safe call to the RPC function
      const { data, error } = await supabase.rpc('get_users_with_details');
      
      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Ensure data is of the expected format
      if (Array.isArray(data)) {
        setUsers(data as User[]);
      } else {
        console.error('Unexpected data format:', data);
        toast({
          title: "Error fetching users",
          description: "Received unexpected data format",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in user management:', error);
      toast({
        title: "An unexpected error occurred",
        description: "Could not fetch user data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    users,
    loading,
    loadUsers
  };
};
