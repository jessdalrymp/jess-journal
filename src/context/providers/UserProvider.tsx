
import React, { useState, useEffect } from 'react';
import { User } from '../../lib/types';
import { useUserActions } from '../../hooks/useUserActions';
import { useToast } from '@/hooks/use-toast';

interface UserContextType {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<User | null>;
}

export const UserContext = React.createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const userActions = useUserActions();
  const { toast } = useToast();

  // Fetch user data
  const fetchUser = async (): Promise<User | null> => {
    try {
      setIsLoadingUser(true);
      const userData = await userActions.fetchUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user:", error);
      toast({
        title: "Error loading user data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading: isLoadingUser,
    fetchUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
