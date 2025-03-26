
import { useState } from 'react';
import { UserProfile } from '../lib/types';
import { getProfileFromStorage, saveProfileToStorage } from '../lib/storageUtils';

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const storedProfile = getProfileFromStorage();
      
      if (storedProfile) {
        setProfile(storedProfile);
      } else {
        // Create default profile if none exists
        const defaultProfile: UserProfile = {
          id: '1',
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          completedOnboarding: false,
        };
        saveProfileToStorage(defaultProfile);
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: Partial<UserProfile>) => {
    if (!userId) return;
    
    try {
      const updatedProfile = {
        ...profile,
        ...profileData,
        userId,
        id: profile?.id || '1',
      };
      
      saveProfileToStorage(updatedProfile as UserProfile);
      setProfile(updatedProfile as UserProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  return { 
    profile, 
    loading, 
    loadProfile, 
    saveProfile 
  };
};
