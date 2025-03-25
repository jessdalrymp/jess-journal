
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
    
    // Check for existing row first to prevent duplicate insertion attempts
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking for existing profile:", checkError);
    } else if (existingProfile) {
      console.log("Profile already exists, skipping creation");
      return { success: true };
    }
    
    // Get current auth session to check permissions
    const { data: authData } = await supabase.auth.getSession();
    console.log("Current auth session:", authData?.session ? "Active" : "None");
    
    // Prepare profile data
    const profileData = {
      id: userId,
      email: email,
      created_at: new Date().toISOString(),
      assessment_completed: false
    };
    
    console.log("Attempting to insert profile with data:", JSON.stringify(profileData, null, 2));
    
    // Try to insert with explicit auth headers to ensure proper permissions
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
        console.error("Check if the auth.users trigger is correctly set up to create profiles automatically");
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
