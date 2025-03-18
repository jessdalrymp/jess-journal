
import { createContext, useContext, ReactNode } from 'react';
import { User } from '../lib/types';
import { useAuthState } from '../hooks/useAuthState';
import { useAuthActions } from '../hooks/useAuthActions';

// Update the return types of signIn and signUp to match what they actually return
interface AuthContextType {
  user: User | null;
  isNewUser: boolean; // Add flag to identify new users
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name?: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  setUser: (user: User) => void; // Add setUser to the context type
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isNewUser: false,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => false,
  setUser: () => {}, // Add setUser to the default context
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isNewUser, loading: stateLoading, setUser } = useAuthState();
  const { signIn, signUp, signOut, resetPassword, loading: actionLoading } = useAuthActions();

  const isLoading = stateLoading || actionLoading;
  console.log("AuthProvider loading state:", isLoading);
  console.log("Current user state:", user);
  console.log("Is new user:", isNewUser);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isNewUser,
        loading: isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        setUser // Expose setUser in the context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
