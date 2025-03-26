
import { supabase } from '../../../integrations/supabase/client';

/**
 * Creates a new user record in the profiles table
 * @param userId The user ID from auth
 * @param email The user's email
 * @param name Optional user name
 * @returns Promise resolving to boolean indicating success
 */
export const createUserRecord = async (userId: string, email: string, name?: string): Promise<boolean> => {
  try {
    console.log("Creating user record for:", userId, email, name);
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      email: email,
      created_at: new Date().toISOString(),
      assessment_completed: false,
      // We can set name in user_metadata but not in profiles directly since there's no name column
    });
    
    if (error) {
      console.error("Error creating user record:", error);
      throw error;
    }
    
    console.log("User record created successfully");
    return true;
  } catch (error) {
    console.error("Exception creating user record:", error);
    throw error;
  }
};
