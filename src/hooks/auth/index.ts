
import { useState, useCallback } from 'react';
import { useSignIn } from './useSignIn';
import { useSignUp } from './useSignUp';
import { useSignOut } from './useSignOut';
import { usePasswordReset } from './usePasswordReset';
import { useAuthCallback } from './useAuthCallback';

export const useAuthActions = () => {
  const { signIn, loading: signInLoading } = useSignIn();
  const { signUp, loading: signUpLoading } = useSignUp();
  const { signOut, loading: signOutLoading } = useSignOut();
  const { resetPassword, loading: resetPasswordLoading } = usePasswordReset();
  const { handleAuthCallback, loading: authCallbackLoading } = useAuthCallback();

  // Compute the overall loading state
  const loading = signInLoading || signUpLoading || signOutLoading || resetPasswordLoading || authCallbackLoading;

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    handleAuthCallback,
    loading
  };
};

// Export individual hooks for direct use when needed
export {
  useSignIn,
  useSignUp,
  useSignOut,
  usePasswordReset,
  useAuthCallback
};
