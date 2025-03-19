
import { useCallback } from 'react';
import { UserProfile } from '../lib/types';
import { useUserDataCore } from './useUserDataCore';
import { useProfileCache } from './useProfileCache';

export function useProfileOperations() {
  const { user, profile, setProfile, userActions, toast } = useUserDataCore();
  const { cacheProfile } = useProfileCache();

  const saveProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    if (!user) {
      return;
    }

    try {
      const updatedProfile = await userActions.saveProfile(user.id, profileData);
      if (updatedProfile) {
        // Update cache
        cacheProfile(user.id, updatedProfile);
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error saving profile",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [user, userActions, toast, cacheProfile, setProfile]);

  return {
    profile,
    saveProfile
  };
}
