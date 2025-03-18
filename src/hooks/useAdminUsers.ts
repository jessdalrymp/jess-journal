
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
      
      // Fetch user profiles
      const profilesData = await fetchUserProfiles();
      
      if (!profilesData || profilesData.length === 0) {
        console.log('No profiles found');
        setUsers([]);
        return;
      }

      console.log(`Found ${profilesData.length} profiles`);

      // Check if current user is admin
      const isCurrentUserAdmin = await checkIsCurrentUserAdmin();
      
      if (isCurrentUserAdmin) {
        // Process users if current user is admin
        await processUsersAsAdmin(profilesData);
      } else {
        // Process users with limited info
        await processUsersAsNonAdmin(profilesData);
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

  // Helper to fetch user profiles
  const fetchUserProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, created_at');

    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }

    return data || [];
  };

  // Helper to check if current user is admin
  const checkIsCurrentUserAdmin = async () => {
    const { data: isAdmin } = await supabase.rpc('check_is_admin');
    return !!isAdmin;
  };

  // Helper to process users when current user is admin
  const processUsersAsAdmin = async (profilesData: any[]) => {
    // Initialize users with basic info
    const usersWithBasicInfo = mapUsersWithBasicInfo(profilesData);
    setUsers(usersWithBasicInfo);
    
    // Then try to fetch and apply admin roles
    try {
      await fetchAndApplyAdminRoles();
    } catch (adminError) {
      console.error('Error fetching admin roles:', adminError);
      // Continue without admin info, we'll still show the users
    }
  };

  // Helper to map users with basic info
  const mapUsersWithBasicInfo = (profilesData: any[]): UserData[] => {
    return profilesData.map(profile => ({
      id: profile.id,
      email: profile.email || 'Unknown',
      created_at: profile.created_at,
      is_admin: false // Default to false, will update if needed
    }));
  };

  // Helper to fetch and apply admin roles
  const fetchAndApplyAdminRoles = async () => {
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
  };

  // Helper to process users when current user is not admin
  const processUsersAsNonAdmin = async (profilesData: any[]) => {
    // Get current user to mark as admin (if they got to this page)
    const { data } = await supabase.auth.getUser();
    const currentUserId = data.user?.id;
    
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
  };

  const toggleAdminRole = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        await removeAdminRole(userId);
      } else {
        await addAdminRole(userId);
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

  // Helper to remove admin role
  const removeAdminRole = async (userId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', 'admin');
      
    if (error) throw error;
  };

  // Helper to add admin role
  const addAdminRole = async (userId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin'
      });
      
    if (error) throw error;
  };

  return {
    users,
    loading,
    toggleAdminRole
  };
}
