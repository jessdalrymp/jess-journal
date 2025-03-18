
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, UserProfile } from '../../lib/types';
import { useUserActions } from '../../hooks/useUserActions';
import { useToast } from '@/hooks/use-toast';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  fetchProfile: () => Promise<UserProfile | null>;
  saveProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  user: User | null;
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ user, children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const userActions = useUserActions();
  const { toast } = useToast();

  // Fetch user profile
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
      return null;
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Save user profile
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

  // Load profile when user changes
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const value = {
    profile,
    loading: isLoadingProfile,
    fetchProfile,
    saveProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
