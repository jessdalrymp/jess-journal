
import { useState, useEffect, useCallback } from 'react';
import { User, UserProfile } from '../lib/types';
import { useUserActions } from './useUserActions';
import { useToast } from '@/hooks/use-toast';
import { useProfileCache } from './useProfileCache';

export function useUserDataCore() {
  const [user, setUser] = useState<User | null | undefined>(null);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const userActions = useUserActions();
  const { toast } = useToast();
  const { getCachedProfile, cacheProfile } = useProfileCache();
  
  // Combined loading state
  const loading = isLoadingUser || isLoadingProfile || userActions.loading;

  const fetchUser = useCallback(async () => {
    try {
      setIsLoadingUser(true);
      const userData = await userActions.fetchUser();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast({
        title: "Error loading user data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setIsLoadingUser(false);
    }
  }, [userActions, toast]);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return null;
    }

    try {
      setIsLoadingProfile(true);
      
      // Check memory cache first
      const cachedProfile = getCachedProfile(user.id);
      if (cachedProfile) {
        setProfile(cachedProfile);
        setIsLoadingProfile(false);
        return cachedProfile;
      }
      
      const profileData = await userActions.fetchProfile(user.id);
      
      if (profileData) {
        // Update cache
        cacheProfile(user.id, profileData);
      }
      
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoadingProfile(false);
      return null;
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user, userActions, getCachedProfile, cacheProfile]);

  return {
    user,
    profile,
    setProfile,
    isLoadingUser,
    isLoadingProfile,
    loading,
    fetchUser,
    fetchProfile,
    userActions,
    toast
  };
}
