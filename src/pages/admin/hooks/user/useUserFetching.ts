
import { useState, useEffect } from 'react';
import { useToast } from "../../../../hooks/use-toast";
import { UserType } from "../useUserManagement";
import { fetchUsersFromDB } from "../../services/userService";

export const useUserFetching = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      
      const { userData, roleData, subscriptionData, error, connectionError } = await fetchUsersFromDB();
      
      if (connectionError || error) {
        console.error('Error fetching users:', error);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers
  };
};
