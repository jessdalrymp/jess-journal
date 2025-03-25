
import { supabase } from '../../integrations/supabase/client';
import { ProfileCreationResult } from './types';

/**
 * Checks if a user exists in the profiles table
 */
export const checkUserProfileExists = async (email: string): Promise<boolean> => {
  try {
    console.log('Checking if user exists in profiles table:', email);
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error("Error checking if user exists:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Exception checking if user exists:", error);
    return false;
  }
};

/**
 * Creates a user profile record
 */
export const createUserProfile = async (
  userId: string, 
  email: string, 
  name?: string
): Promise<ProfileCreationResult> => {
  try {
    console.log("Creating user profile record for:", userId, email);
    
    // Include the user's role in the profile creation for debugging
    const { data: roleData } = await supabase.auth.getUser();
    console.log("Current user role:", roleData?.user?.role);
    
    const profileData = {
      id: userId,
      email: email,
      created_at: new Date().toISOString(),
      assessment_completed: false
    };
    
    console.log("Attempting to insert profile with data:", JSON.stringify(profileData, null, 2));
    
    const { error } = await supabase.from('profiles').upsert(profileData);
    
    if (error) {
      console.error("Error creating user profile:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      // Check for specific permission errors
      if (error.message?.includes("permission denied") || error.code === "42501") {
        console.error("PERMISSION DENIED: The current user does not have permission to create profiles");
        console.error("This might be due to incorrect RLS policies or the user not having the right role");
      }
      
      return { success: false, error };
    }
    
    console.log("Profile record created successfully");
    return { success: true };
  } catch (error: any) {
    console.error("Exception creating user profile:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return { success: false, error };
  }
};
