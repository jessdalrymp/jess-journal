
import { createContext, useContext, ReactNode } from 'react';
import { User } from '../lib/types';
import { useAuthState } from '../hooks/useAuthState';
import { useAuthActions } from '../hooks/useAuthActions';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: stateLoading } = useAuthState();
  const { signIn, signUp, signOut, loading: actionLoading } = useAuthActions();

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading: stateLoading || actionLoading,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
