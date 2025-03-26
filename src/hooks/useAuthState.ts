
import { useState, useEffect } from 'react';
import { User } from '../lib/types';
import { supabase } from '../integrations/supabase/client';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Initializing auth state");
        setLoading(true);
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setUser(null);
          return;
        }
        
        if (session?.user) {
          console.log("User found in session:", session.user.id);
          
          // Check if user is a new user from metadata
          const isNewUserFlag = session.user.user_metadata?.isNewUser;
          setIsNewUser(!!isNewUserFlag);
          
          if (isNewUserFlag) {
            // Clear the new user flag once we've detected it
            await supabase.auth.updateUser({
              data: { isNewUser: false }
            });
            console.log("Cleared new user flag");
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            createdAt: new Date(session.user.created_at),
          });
        } else {
          console.log("No user session found");
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('User authenticated:', session.user.email);
            
            // Check if user is a new user from metadata
            const isNewUserFlag = session.user.user_metadata?.isNewUser;
            setIsNewUser(!!isNewUserFlag);
            
            if (isNewUserFlag && event === 'SIGNED_IN') {
              // Clear the new user flag once we've detected it
              await supabase.auth.updateUser({
                data: { isNewUser: false }
              });
              console.log("Cleared new user flag after sign in");
            }
            
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              createdAt: new Date(session.user.created_at),
            });
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setIsNewUser(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isNewUser, setUser, loading };
};
