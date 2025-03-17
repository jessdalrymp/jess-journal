
import { useState, useEffect, useCallback } from 'react';
import { User, UserProfile } from '../lib/types';
import { useUserActions } from './useUserActions';
import { useToast } from '@/hooks/use-toast';

// Memory cache for user profiles
const profileCache: Record<string, {
  data: UserProfile;
  timestamp: number;
}> = {};

// Cache expiration time (10 minutes)
const CACHE_EXPIRATION = 10 * 60 * 1000;

export function useUserData() {
  const [user, setUser] = useState<User | null | undefined>(null);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingJournal, setIsLoadingJournal] = useState(false);
  const userActions = useUserActions();
  const { toast } = useToast();
  
  // Combined loading state
  const loading = isLoadingUser || isLoadingProfile || isLoadingJournal || userActions.loading;

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
      const cachedProfile = profileCache[user.id];
      if (cachedProfile && (Date.now() - cachedProfile.timestamp) < CACHE_EXPIRATION) {
        console.log('Using cached user profile');
        setProfile(cachedProfile.data);
        setIsLoadingProfile(false);
        return cachedProfile.data;
      }
      
      const profileData = await userActions.fetchProfile(user.id);
      
      if (profileData) {
        // Update cache
        profileCache[user.id] = {
          data: profileData,
          timestamp: Date.now()
        };
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
  }, [user, userActions]);

  const saveProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    if (!user) {
      return;
    }

    try {
      const updatedProfile = await userActions.saveProfile(user.id, profileData);
      if (updatedProfile) {
        // Update cache
        profileCache[user.id] = {
          data: updatedProfile,
          timestamp: Date.now()
        };
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
  }, [user, userActions, toast]);

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
