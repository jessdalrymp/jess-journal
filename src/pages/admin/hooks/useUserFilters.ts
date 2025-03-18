
import { useState, useCallback, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  created_at: string;
  profile_data: any;
  subscription_data: any;
  is_admin: boolean;
}

export const useUserFilters = (users: User[]) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'email' | 'id'>('email');
  const [currentTab, setCurrentTab] = useState('all');

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
    applyFilters(users, searchTerm, currentTab);
  }, [searchTerm, searchField, currentTab, users, applyFilters]);

  return {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    currentTab,
    setCurrentTab
  };
};
