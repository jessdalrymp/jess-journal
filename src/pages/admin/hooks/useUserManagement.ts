
import { useState, useEffect, useCallback } from 'react';
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

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'email' | 'id'>('email');
  const [currentTab, setCurrentTab] = useState('all');
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Use type assertion to bypass TypeScript checking for RPC functions
      const { data, error } = await supabase.rpc('get_users_with_details') as any;
      
      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Cast the data to the User[] type
      const userData = data as User[];
      setUsers(userData);
      applyFilters(userData, searchTerm, currentTab);
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
  }, [toast, searchTerm, currentTab]);

  const applyFilters = useCallback((userList: User[], term: string, tab: string) => {
    let filtered = [...userList];
    
    // Apply search filter
    if (term) {
      filtered = filtered.filter(user => 
        searchField === 'email' ? 
        user.email.toLowerCase().includes(term.toLowerCase()) : 
        user.id.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (tab === 'admin') {
      filtered = filtered.filter(user => user.is_admin);
    } else if (tab === 'subscribed') {
      filtered = filtered.filter(user => 
        user.subscription_data && 
        (user.subscription_data.status === 'active' || user.subscription_data.is_unlimited)
      );
    } else if (tab === 'trial') {
      filtered = filtered.filter(user => 
        user.subscription_data && user.subscription_data.is_trial
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchField]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    applyFilters(users, searchTerm, currentTab);
  }, [searchTerm, searchField, currentTab, users, applyFilters]);

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Use type assertion to bypass TypeScript checking for RPC functions
      const { data, error } = await supabase.rpc(
        'toggle_user_admin_status',
        { p_user_id: userId, p_admin_status: !currentStatus }
      ) as any;
      
      if (error) {
        console.error('Error updating admin status:', error);
        toast({
          title: "Error updating admin status",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        // Update the local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, is_admin: !currentStatus } : user
        ));
        
        toast({
          title: "Admin status updated",
          description: `User is now ${!currentStatus ? 'an admin' : 'not an admin'}`,
        });
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast({
        title: "An unexpected error occurred",
        description: "Could not update admin status",
        variant: "destructive"
      });
    }
  };

  const applyCouponToUser = async (userId: string, couponCode: string) => {
    if (!couponCode.trim()) {
      toast({
        title: "Missing coupon code",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Use type assertion to bypass TypeScript checking for RPC functions
      const { data, error } = await supabase.rpc(
        'apply_coupon_to_user',
        { p_user_id: userId, p_coupon_code: couponCode.trim() }
      ) as any;
      
      if (error) {
        console.error('Error applying coupon:', error);
        toast({
          title: "Error applying coupon",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        // Refresh user data
        loadUsers();
        
        toast({
          title: "Coupon applied successfully",
          description: `Coupon ${couponCode} has been applied to the user`,
        });
      } else {
        toast({
          title: "Coupon application failed",
          description: "The coupon could not be applied",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "An unexpected error occurred",
        description: "Could not apply coupon",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubscriptionStatus = (user: User) => {
    if (!user.subscription_data) return 'None';
    
    if (user.subscription_data.is_unlimited) return 'Unlimited';
    if (user.subscription_data.is_trial) return 'Trial';
    if (user.subscription_data.status === 'active') return 'Active';
    
    return user.subscription_data.status || 'None';
  };

  const getSubscriptionExpiry = (user: User) => {
    if (!user.subscription_data) return 'N/A';
    
    if (user.subscription_data.is_unlimited) return 'Never';
    if (user.subscription_data.is_trial && user.subscription_data.trial_ends_at) {
      return formatDate(user.subscription_data.trial_ends_at);
    }
    if (user.subscription_data.current_period_ends_at) {
      return formatDate(user.subscription_data.current_period_ends_at);
    }
    
    return 'N/A';
  };

  return {
    users: filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    currentTab,
    setCurrentTab,
    loadUsers,
    toggleAdminStatus,
    applyCouponToUser,
    formatDate,
    getSubscriptionStatus,
    getSubscriptionExpiry
  };
};
