
import { useState, useEffect } from 'react';
import { supabase } from "../../../integrations/supabase/client";
import { useToast } from "../../../hooks/use-toast";

export interface UserType {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string | null;
  is_admin: boolean;
}

export const useUserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      
      const { data, error } = await supabase.rpc('get_users_with_details');
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      console.log("User data received:", data);
      
      if (!data) {
        setUsers([]);
        return;
      }
      
      // Map the returned data to the UserType format
      const mappedUsers = data.map(user => {
        // Extract last_sign_in_at from the profile_data
        let lastSignIn = null;
        
        if (user.profile_data && 
            typeof user.profile_data === 'object' && 
            !Array.isArray(user.profile_data)) {
          
          // Access last_session safely with optional chaining
          lastSignIn = user.profile_data.last_session || null;
          console.log(`User ${user.email} last session:`, lastSignIn);
        }
        
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: lastSignIn,
          is_admin: user.is_admin || false
        };
      });
      
      console.log("Mapped users:", mappedUsers);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    fetchUsers
  };
};
