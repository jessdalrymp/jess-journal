
import { useEffect } from 'react';
import { useUserDataFetcher } from './useUserDataFetcher';
import { useUserFilters } from './useUserFilters';
import { useUserActions } from './useUserActions';
import { useSubscriptionHelpers } from './useSubscriptionHelpers';

export const useUserManagement = () => {
  // Fetch user data
  const { users, loading, loadUsers } = useUserDataFetcher();
  
  // Filter user data
  const { 
    filteredUsers, 
    searchTerm, 
    setSearchTerm, 
    searchField, 
    setSearchField, 
    currentTab, 
    setCurrentTab 
  } = useUserFilters(users);

  // User actions
  const { toggleAdminStatus, applyCouponToUser } = useUserActions(loadUsers);

  // Subscription helpers
  const { formatDate, getSubscriptionStatus, getSubscriptionExpiry } = useSubscriptionHelpers();

  // Initial data load
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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
