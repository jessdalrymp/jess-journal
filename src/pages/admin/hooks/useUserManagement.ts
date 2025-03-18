
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
      
      // Using the RPC function which handles access to auth.users
      const { data, error } = await supabase.rpc('get_users_with_details');
      
      if (error) {
        console.error('Error fetching users with RPC:', error);
        throw error;
      }
      
      console.log("User data received:", data);
      
      if (!data) {
        setUsers([]);
        return;
      }
      
      // Map the returned data to the UserType format
      const mappedUsers = data.map((user: any) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.profile_data?.last_session || null,
        is_admin: user.is_admin || false
      }));
      
      console.log("Mapped users:", mappedUsers);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: "Please try again later",
        variant: "destructive"
      });
      
      // Fallback to querying tables we know we have access to
      try {
        console.log("Attempting fallback query...");
        
        // Get basic user data from public.users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, created_at, last_session');
          
        if (userError) {
          console.error('Fallback user query failed:', userError);
          throw userError;
        }
        
        // Get admin role data
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id, role');
          
        if (roleError) {
          console.error('Fallback role query failed:', roleError);
        }
        
        // Create a map of user_id to admin status
        const adminMap = new Map();
        if (roleData) {
          roleData.forEach((role: any) => {
            if (role.role === 'admin') {
              adminMap.set(role.user_id, true);
            }
          });
        }
        
        // Combine the data
        const fallbackUsers = userData.map((user: any) => ({
          id: user.id,
          email: user.email || 'Unknown',
          created_at: user.created_at || new Date().toISOString(),
          last_sign_in_at: user.last_session || null,
          is_admin: adminMap.get(user.id) || false
        }));
        
        console.log("Fallback users:", fallbackUsers);
        setUsers(fallbackUsers);
      } catch (fallbackError) {
        console.error('All fallback queries failed:', fallbackError);
        setUsers([]);
      }
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
