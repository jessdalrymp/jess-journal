
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../integrations/supabase/client';

export const AuthCallback = () => {
  const { handleAuthCallback, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        console.log('=== Processing auth callback ===');
        console.log('Current URL:', window.location.href);
        
        // Extract hash and query parameters for debugging
        const hash = window.location.hash;
        const query = window.location.search;
        console.log('URL hash:', hash);
        console.log('URL query params:', query);
        
        // Check if this is a password reset request by examining the hash
        if (hash && hash.includes('type=recovery')) {
          console.log("Found password reset link, redirecting to reset page");
          navigate('/auth/reset-password');
          return;
        }

        // Check for email verification
        if (query && query.includes('signUpEmail=')) {
          console.log('Email verification detected');
        }

        // Check current auth status
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Current session before callback:', sessionData?.session ? 'Exists' : 'None');

        const session = await handleAuthCallback();
        
        if (session) {
          console.log("Auth callback successful");
          console.log("Session details:", JSON.stringify(session, null, 2));
          
          // Check if user profile exists
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileError) {
              console.error('Error fetching profile after auth:', profileError);
              console.error('Error details:', JSON.stringify(profileError, null, 2));
              
              // Check if the error is due to missing profile
              if (profileError.code === 'PGRST116') {
                console.log('Profile does not exist, this may indicate the profile creation failed during signup');
                
                // Try to manually create the profile
                console.log('Attempting to manually create profile...');
                const { error: createError } = await supabase.from('profiles').upsert({
                  id: session.user.id,
                  email: session.user.email,
                  created_at: new Date().toISOString(),
                  assessment_completed: false
                });
                
                if (createError) {
                  console.error('Manual profile creation failed:', createError);
                  console.error('Error details:', JSON.stringify(createError, null, 2));
                } else {
                  console.log('Profile created manually');
                }
              }
            } else {
              console.log('Profile after auth:', profile ? 'Found' : 'Not found');
            }
          } catch (profileError) {
            console.error('Exception fetching profile:', profileError);
          }
          
          // If auth was successful, redirect to dashboard
          navigate('/dashboard');
        } else {
          console.log("No session from auth callback");
          // If no session was returned, redirect to login
          navigate('/');
        }
      } catch (err: any) {
        console.error("Error in auth callback:", err);
        console.error("Error stack:", err.stack);
        setError(err.message || "Authentication failed. Please try again.");
        // On error, redirect to login page after a delay
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setProcessing(false);
      }
    };

    // If user is already authenticated, redirect to dashboard
    if (user) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }

    processAuthCallback();
  }, [handleAuthCallback, navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-6 max-w-sm">
        {error ? (
          <div className="text-red-500">
            <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
            <p>{error}</p>
            <p className="mt-4 text-sm">Redirecting you to the login page...</p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-jess-subtle animate-pulse-soft flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-jess-primary"></div>
            </div>
            <p className="text-jess-muted">
              {processing ? "Processing authentication..." : "Completing authentication..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
