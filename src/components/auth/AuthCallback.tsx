
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AuthCallback = () => {
  const { handleAuthCallback, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        // Check if this is a password reset request by examining the hash
        const hash = window.location.hash;
        if (hash && hash.includes('type=recovery')) {
          console.log("Found password reset link, redirecting to reset page");
          navigate('/auth/reset-password');
          return;
        }

        const session = await handleAuthCallback();
        
        if (session) {
          console.log("Auth callback successful");
          // If auth was successful, redirect to dashboard
          navigate('/', { replace: true });
        } else {
          console.log("No session from auth callback");
          // If no session was returned, redirect to login
          navigate('/', { replace: true });
        }
      } catch (err: any) {
        console.error("Error in auth callback:", err);
        setError(err.message || "Authentication failed. Please try again.");
        // On error, redirect to login page after a delay
        setTimeout(() => navigate('/', { replace: true }), 3000);
      }
    };

    // If user is already authenticated, redirect to dashboard
    if (user) {
      navigate('/', { replace: true });
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
            <p className="text-jess-muted">Completing authentication...</p>
          </div>
        )}
      </div>
    </div>
  );
};
