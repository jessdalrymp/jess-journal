
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
        name: authUser.user_metadata?.name,
        createdAt: new Date(authUser.created_at || Date.now())
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

    const { data: profileData, error } = await supabase
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
      id: profileData.id,
      userId: userId,
      email: profileData.email || undefined,
      growthStage: profileData.growth_stage || undefined,
      challenges: profileData.goals || undefined,
      mindsetPatterns: undefined,
      learningStyle: profileData.learning_style || undefined,
      supportNeeds: undefined,
      communicationPreference: profileData.communication_style || undefined,
      engagementMode: undefined,
      completedOnboarding: profileData.assessment_completed || false
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
      completedOnboarding: false 
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
