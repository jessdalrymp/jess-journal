
import { useState } from 'react';
import { UserProfile, User } from '../lib/types';
import { useUserActions } from './useUserActions';
import { useToast } from '@/components/ui/use-toast';

export function useUserProfileContext() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const userActions = useUserActions();
  const { toast } = useToast();
  
  const fetchUser = async (): Promise<User | null> => {
    try {
      setIsLoadingUser(true);
      const userData = await userActions.fetchUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user:", error);
      toast({
        title: "Error loading user data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchProfile = async (): Promise<UserProfile | null> => {
    if (!user) {
      setProfile(null);
      return null;
    }

    try {
      setIsLoadingProfile(true);
      const profileData = await userActions.fetchProfile(user.id);
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoadingProfile(false);
      return null;
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const saveProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      const updatedProfile = await userActions.saveProfile(user.id, profileData);
      if (updatedProfile) {
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
  };
  
  return {
    user,
    profile,
    isLoadingUser,
    isLoadingProfile,
    fetchUser,
    fetchProfile,
    saveProfile
  };
}
