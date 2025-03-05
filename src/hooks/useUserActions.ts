
import { useState } from 'react';
import { User, UserProfile } from '../lib/types';
import { useToast } from '@/hooks/use-toast';
import * as userService from '../services/userService';

export function useUserActions() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const userData = await userService.fetchUser();
      return userData;
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "Error fetching user",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    try {
      const profileData = await userService.fetchProfile(userId);
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (userId: string, profileData: Partial<UserProfile>) => {
    setLoading(true);
    try {
      const updatedProfile = await userService.saveProfile(userId, profileData);
      toast({
        title: "Profile saved",
        description: "Your profile has been updated.",
      });
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchUser,
    fetchProfile,
    saveProfile,
  };
}
