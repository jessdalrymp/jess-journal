
import { useEffect } from 'react';
import { useUserDataCore } from './useUserDataCore';
import { useProfileOperations } from './useProfileOperations';

export function useUserData() {
  const { 
    user, 
    profile, 
    loading, 
    fetchUser, 
    fetchProfile 
  } = useUserDataCore();
  
  const { saveProfile } = useProfileOperations();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  return {
    user,
    profile,
    loading,
    fetchUser,
    fetchProfile,
    saveProfile
  };
}
