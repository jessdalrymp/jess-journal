
import { useSignUpCore } from './useSignUpCore';
import { checkUserProfileExists, createUserProfile } from './signupUtils';
import { SignUpResult } from './types';

export const useSignUp = () => {
  const { signUp, loading } = useSignUpCore();

  return { 
    signUp, 
    checkUserExists: checkUserProfileExists,
    createUserRecord: createUserProfile,
    loading 
  };
};
