
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SocialLoginButtonsProps {
  isLogin: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ isLogin }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // Get the current origin (domain) to use for redirection
      const origin = window.location.origin;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`
        }
      });

      if (error) {
        console.error("Google auth error:", error);
        throw error;
      }

      console.log("Google auth initiated:", data);
    } catch (error: any) {
      console.error('Google authentication error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-jess-muted mb-4">
        {isLogin ? 'Or sign in with' : 'Or sign up with'}
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 w-full py-2.5 border border-jess-border rounded-md text-jess-foreground hover:bg-jess-subtle/50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">Connecting...</span>
          </>
        ) : (
          <>
            <FcGoogle className="w-5 h-5" />
            <span className="font-medium">{isLogin ? 'Continue with Google' : 'Sign up with Google'}</span>
          </>
        )}
      </button>
    </div>
  );
};
