
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
      
      // Skip the RPC function since it's giving type errors and go straight to the tables we know work
      // Get basic user data from public.users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, created_at, last_session');
        
      if (userError) {
        console.error('User query failed:', userError);
        throw userError;
      }
      
      // Get admin role data
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role');
        
      if (roleError) {
        console.error('Role query failed:', roleError);
        // Don't throw here, just log and continue with what we have
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
      const mappedUsers = userData.map((user: any) => ({
        id: user.id,
        email: user.email || 'Unknown',
        created_at: user.created_at || new Date().toISOString(),
        last_sign_in_at: user.last_session || null,
        is_admin: adminMap.get(user.id) || false
      }));
      
      console.log("Users:", mappedUsers);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: "Could not retrieve user data",
        variant: "destructive"
      });
      setUsers([]);
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
