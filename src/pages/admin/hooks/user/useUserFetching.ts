
import { useState, useEffect } from 'react';
import { useToast } from "../../../../hooks/use-toast";
import { UserType } from "../useUserManagement";
import { fetchUsersFromDB } from "../../services/userService";

export const useUserFetching = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      setPermissionError(false);
      console.log("Fetching users...");
      
      const { userData, roleData, subscriptionData, error, connectionError } = await fetchUsersFromDB();
      
      if (connectionError || error) {
        console.error('Error fetching users:', error);
        
        // Check if it's a permissions error
        if (error?.message?.includes('permission denied') || 
            error?.message?.includes('additional permissions') ||
            error?.message?.includes('access')) {
          setPermissionError(true);
          setError("You don't have sufficient permissions to view user data.");
        } else {
          setError(error?.message || "Could not retrieve user data");
        }
        
        toast({
          title: "Error fetching users",
          description: error?.message || "Could not retrieve user data",
          variant: "destructive"
        });
        setUsers([]);
        return;
      }
      
      if (!userData || !Array.isArray(userData)) {
        console.error('Invalid user data returned:', userData);
        setError("Received invalid user data format");
        toast({
          title: "Error fetching users",
          description: "Received invalid user data format",
          variant: "destructive"
        });
        setUsers([]);
        return;
      }
      
      console.log("Fetched user data:", userData);
      console.log("Fetched role data:", roleData);
      console.log("Fetched subscription data:", subscriptionData);
      
      // Create a map of user_id to admin status
      const adminMap = new Map();
      if (roleData && Array.isArray(roleData)) {
        roleData.forEach((role: any) => {
          if (role.role === 'admin') {
            adminMap.set(role.user_id, true);
          }
        });
      }
      
      // Create a map of user_id to subscription data
      const subscriptionMap = new Map();
      if (subscriptionData && Array.isArray(subscriptionData)) {
        subscriptionData.forEach((sub: any) => {
          subscriptionMap.set(sub.user_id, {
            status: sub.status,
            is_trial: sub.is_trial,
            is_unlimited: sub.is_unlimited,
            trial_ends_at: sub.trial_ends_at,
            current_period_ends_at: sub.current_period_ends_at
          });
        });
      }
      
      // Combine the data
      const mappedUsers = userData.map((user: any) => ({
        id: user.id,
        email: user.email || 'Unknown',
        created_at: user.created_at || new Date().toISOString(),
        last_sign_in_at: user.last_session || null,
        is_admin: adminMap.get(user.id) || false,
        subscription: subscriptionMap.get(user.id) || null
      }));
      
      console.log("Mapped users:", mappedUsers);
      setUsers(mappedUsers);
    } catch (error: any) {
      console.error('Error in fetchUsers:', error);
      setError("Could not retrieve user data");
      setUsers([]);
      toast({
        title: "Error fetching users",
        description: "Could not retrieve user data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    permissionError,
    fetchUsers
  };
};
