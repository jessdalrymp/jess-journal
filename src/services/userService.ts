
import { User, UserProfile } from '../lib/types';
import { supabase } from '../integrations/supabase/client';
import { getProfileFromStorage, saveProfileToStorage } from '../lib/storageUtils';

export const fetchUser = async (): Promise<User | null> => {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const userData: User = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        createdAt: new Date(authUser.created_at || Date.now()),
        updatedAt: new Date()
      };
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const fetchProfile = async (userId: string | undefined): Promise<UserProfile | null> => {
  if (!userId) {
    return null;
  }

  try {
    const storedProfile = getProfileFromStorage();
    if (storedProfile && storedProfile.userId === userId) {
      console.log("Profile loaded from local storage");
      return storedProfile;
    }

    const { data: userData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile from Supabase:', error);
      if (error.code !== 'PGRST116') {
        throw error;
      }
      return null;
    }

    const userProfile: UserProfile = {
      id: userData.id,
      userId: userId,
      firstName: undefined,
      lastName: undefined,
      email: userData.email || undefined,
      growthStage: userData.growth_stage || undefined,
      challenges: userData.goals || undefined,
      goals: userData.goals || undefined,
      mindsetPatterns: undefined,
      learningStyle: userData.learning_style || undefined,
      supportNeeds: undefined,
      communicationPreference: userData.communication_style || undefined,
      engagementMode: undefined,
      completedOnboarding: userData.assessment_completed || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {}
    };
    
    saveProfileToStorage(userProfile);
    console.log("Profile loaded from Supabase");
    return userProfile;
  } catch (error) {
    console.error('Error processing profile data:', error);
    throw error;
  }
};

export const saveProfile = async (userId: string | undefined, profileData: Partial<UserProfile>): Promise<UserProfile> => {
  if (!userId) {
    throw new Error("User ID is required to save profile");
  }

  try {
    const currentProfile = await fetchProfile(userId) || { 
      id: userId,
      userId: userId,
      completedOnboarding: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedProfile = { ...currentProfile, ...profileData };

    const supabaseProfileData = {
      id: userId,
      growth_stage: updatedProfile.growthStage,
      goals: updatedProfile.challenges,
      learning_style: updatedProfile.learningStyle,
      communication_style: updatedProfile.communicationPreference,
      assessment_completed: updatedProfile.completedOnboarding,
      email: updatedProfile.email || ''
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(supabaseProfileData, { onConflict: 'id' });

    if (error) {
      console.error('Error saving profile:', error);
      throw error;
    }

    saveProfileToStorage(updatedProfile);
    console.log("Profile saved successfully");
    
    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
