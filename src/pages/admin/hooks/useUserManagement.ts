
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
      
      // Fetch all users from auth.users
      const { data: authUsers, error: authError } = await supabase.from('users').select('*');
      
      if (authError) throw authError;
      
      // Fetch admin users
      const { data: adminUsers, error: adminError } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');
      
      if (adminError) throw adminError;
      
      // Create a set of admin user IDs for quick lookup
      const adminUserIds = new Set(adminUsers.map(admin => admin.user_id));
      
      // Map users with admin status
      const mappedUsers = (authUsers || []).map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        is_admin: adminUserIds.has(user.id)
      }));
      
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
