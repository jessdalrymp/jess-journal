
import { useState, useEffect } from 'react';
import { User, UserProfile } from '../lib/types';
import { useUserActions } from './useUserActions';
import { useToast } from '@/components/ui/use-toast';

export function useUserData() {
  const [user, setUser] = useState<User | null | undefined>(null);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(null);
  const userActions = useUserActions();
  const { toast } = useToast();
  
  const loading = userActions.loading;

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const userData = await userActions.fetchUser();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast({
        title: "Error loading user data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    }
  };

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const profileData = await userActions.fetchProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const saveProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      return;
    }

    const updatedProfile = await userActions.saveProfile(user.id, profileData);
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  };

  return {
    user,
    profile,
    loading,
    fetchUser,
    fetchProfile,
    saveProfile
  };
}
