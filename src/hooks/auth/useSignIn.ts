
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/lib/types';

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Signing in with:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Authentication error:", error);
        throw error;
      }

      console.log("Sign-in successful response:", data);
      
      if (data?.user) {
        console.log("Sign-in successful for user:", data.user.id);
        
        // Map the Supabase user to our application's User type
        const appUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          createdAt: new Date(data.user.created_at),
        };
        
        // Update the auth context with the mapped user
        setUser(appUser);
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        
        // Navigate to the dashboard after successful login
        navigate('/');
        return data;
      } else {
        console.error("No user returned after sign in");
        throw new Error("Authentication failed. Please try again.");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading };
};
