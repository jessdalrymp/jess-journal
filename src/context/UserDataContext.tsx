
import { createContext, useContext } from 'react';
import { UserData } from './types';
import { UserDataProvider } from './UserDataProvider';

// Create the context with undefined as the default value
export const UserDataContext = createContext<UserData | undefined>(undefined);

// Custom hook to use the UserData context
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

// Re-export the UserDataProvider for convenience
export { UserDataProvider };
