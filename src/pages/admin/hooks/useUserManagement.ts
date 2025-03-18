
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
      
      // Try with explicit SQL query instead of the RPC function
      const { data, error } = await supabase
        .from('auth.users')
        .select(`
          id,
          email,
          created_at,
          profile:users(last_session),
          is_admin:user_roles(role)
        `)
        .order('created_at', { ascending: false });
      
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
        // Check if user has admin role
        const isAdmin = user.is_admin && user.is_admin.some((role: any) => role.role === 'admin');
        
        // Extract last sign in time if available
        let lastSignIn = null;
        if (user.profile && user.profile.length > 0) {
          lastSignIn = user.profile[0].last_session;
        }
        
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: lastSignIn,
          is_admin: isAdmin || false
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
      
      // Fallback to direct SQL query if RPC function fails
      try {
        console.log("Attempting fallback query...");
        const { data: users, error: usersError } = await supabase
          .from('auth.users')
          .select('id, email, created_at');
          
        if (usersError) throw usersError;
        
        const simpleMappedUsers = users.map(user => ({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: null,
          is_admin: false
        }));
        
        console.log("Fallback users:", simpleMappedUsers);
        setUsers(simpleMappedUsers);
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
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
