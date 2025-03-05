import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, UserProfile } from '../lib/types';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getProfileFromStorage, saveProfileToStorage } from '../lib/storageUtils';

interface UserData {
  user: User | null | undefined;
  profile: UserProfile | null | undefined;
  loading: boolean;
  fetchUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  saveProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

const UserDataContext = createContext<UserData | undefined>(undefined);

interface UserDataProviderProps {
  children: React.ReactNode;
}

const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(null);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUser();
    fetchProfile();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "Error fetching user",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setLoading(true);
    try {
      // First, try to get the profile from local storage
      const storedProfile = getProfileFromStorage();
      if (storedProfile && storedProfile.userId === user.id) {
        setProfile(storedProfile);
        console.log("Profile loaded from local storage");
        return;
      }

      // If not in local storage, fetch from Supabase
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('userId', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
        // If profile doesn't exist, that's okay, we'll create it later
        if (error.code !== 'PGRST116') {
          toast({
            title: "Error fetching profile",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
        setProfile(null);
        return;
      }

      const userProfile: UserProfile = profileData;
      setProfile(userProfile);
      saveProfileToStorage(userProfile); // Save to local storage
      console.log("Profile loaded from Supabase");
    } catch (error) {
      console.error('Error processing profile data:', error);
      toast({
        title: "Error processing profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to save your profile.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const currentProfile = profile || { userId: user.id };
      const updatedProfile = { ...currentProfile, ...profileData, userId: user.id };

      const { data, error } = await supabase
        .from('profiles')
        .upsert([updatedProfile], { onConflict: 'userId' })
        .select()
        .single();

      if (error) {
        console.error('Error saving profile:', error);
        toast({
          title: "Error saving profile",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      const newUserProfile: UserProfile = data;
      setProfile(newUserProfile);
      saveProfileToStorage(newUserProfile); // Save to local storage
      console.log("Profile saved successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value: UserData = {
    user,
    profile,
    loading,
    fetchUser,
    fetchProfile,
    saveProfile,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export { UserDataProvider };
