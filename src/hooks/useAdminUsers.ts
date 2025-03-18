
import { useState, useEffect } from 'react';
import { supabase } from "../integrations/supabase/client";
import { useToast } from "../hooks/use-toast";

export interface UserData {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
}

export function useAdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all users from profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, created_at');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      if (!profilesData || profilesData.length === 0) {
        console.log('No profiles found');
        setUsers([]);
        return;
      }

      console.log(`Found ${profilesData.length} profiles`);

      // Get the current user's admin status
      const { data: isCurrentUserAdmin } = await supabase.rpc('check_is_admin');
      
      if (isCurrentUserAdmin) {
        // If we're an admin, we can safely use this information
        const usersWithRoles = profilesData.map(profile => {
          return {
            id: profile.id,
            email: profile.email || 'Unknown',
            created_at: profile.created_at,
            is_admin: false // We'll update admin statuses in a separate step if needed
          };
        });
        
        setUsers(usersWithRoles);
        
        // Try to get admin info if possible
        try {
          // Try a direct query if the user is an admin
          const { data: adminRolesData, error: adminRolesError } = await supabase
            .from('user_roles')
            .select('user_id')
            .eq('role', 'admin');
            
          if (!adminRolesError && adminRolesData) {
            // Create a set of admin user IDs for quick lookup
            const adminUserIds = new Set(adminRolesData.map(role => role.user_id));
            
            // Update the users array with admin status
            setUsers(prevUsers => 
              prevUsers.map(user => ({
                ...user,
                is_admin: adminUserIds.has(user.id)
              }))
            );
          }
        } catch (adminError) {
          console.error('Error fetching admin roles:', adminError);
          // Continue without admin info, we'll still show the users
        }
      } else {
        // Fallback approach - just mark the current user as admin if we got to this page
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        const currentUserId = currentUser?.id;
        
        const usersWithRoles = profilesData.map(profile => {
          // Current user is admin if they got to this page
          const isAdmin = profile.id === currentUserId;
          
          return {
            id: profile.id,
            email: profile.email || 'Unknown',
            created_at: profile.created_at,
            is_admin: isAdmin
          };
        });
        
        setUsers(usersWithRoles);
      }
      
      console.log(`Processed ${users.length} users with roles`);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: "Please check console for details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminRole = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
          
        if (error) throw error;
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'admin'
          });
          
        if (error) throw error;
      }
      
      // Refresh users list
      fetchUsers();
      
      toast({
        title: "Success",
        description: `Admin role ${isCurrentlyAdmin ? 'removed from' : 'granted to'} user`,
      });
    } catch (error) {
      console.error('Error toggling admin role:', error);
      toast({
        title: "Error updating user role",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return {
    users,
    loading,
    toggleAdminRole
  };
}
