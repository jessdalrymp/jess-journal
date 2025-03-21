
import { supabase } from "../../../integrations/supabase/client";

/**
 * Fetches all users with their profiles, roles, and subscription data
 * @returns An object containing user data
 */
export const fetchUsersFromDB = async () => {
  try {
    // Get user data directly from profiles since public.users doesn't exist
    console.log("Fetching user data from profiles table");
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, created_at, last_session');
      
    if (profileError) {
      console.error('Profile query failed:', profileError);
      return { 
        userData: null, 
        error: profileError, 
        connectionError: true 
      };
    }
    
    if (!profileData || profileData.length === 0) {
      console.log("No user profiles found");
      return {
        userData: [],
        roleData: [],
        subscriptionData: [],
        error: null,
        connectionError: false
      };
    }
    
    // Map profile data to match the expected structure
    const mappedUserData = profileData.map(profile => ({
      id: profile.id,
      email: profile.email || '',
      created_at: profile.created_at,
      profile_data: {},
      subscription_data: {},
      is_admin: false
    }));
      
    // Get admin role data
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('user_id, role');
        
    if (roleError) {
      console.error('Role query failed:', roleError);
      // Don't throw here, just log and continue with what we have
    }
      
    // Get subscription data
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*');
      
    if (subscriptionError) {
      console.error('Subscription query failed:', subscriptionError);
      // Don't throw here, just log and continue with what we have
    }
      
    return { 
      userData: mappedUserData,
      roleData: roleData || [],
      subscriptionData: subscriptionData || [],
      error: null, 
      connectionError: false 
    };
  } catch (error: any) {
    console.error('Error in fetchUsersFromDB:', error);
    return { 
      userData: null, 
      error: new Error(error.message || "Unknown error occurred"), 
      connectionError: true 
    };
  }
};

/**
 * Toggle admin status for a user
 * @param userId User ID to toggle
 * @param currentAdminStatus Current admin status
 * @returns Success status
 */
export const toggleUserAdminStatusInDB = async (userId: string, currentAdminStatus: boolean) => {
  try {
    // Call the RPC function to toggle admin status
    const { data, error } = await supabase.rpc('toggle_user_admin_status', {
      p_user_id: userId,
      p_admin_status: !currentAdminStatus
    });
    
    if (error) {
      console.error('Error toggling admin status:', error);
      return { 
        success: false, 
        error
      };
    }
    
    return {
      success: true,
      newStatus: !currentAdminStatus,
      error: null
    };
  } catch (error: any) {
    console.error('Error in toggleUserAdminStatusInDB:', error);
    return { 
      success: false, 
      error: new Error(error.message || "Unknown error occurred")
    };
  }
};

/**
 * Delete a user
 * @param userId User ID to delete
 * @returns Success status
 */
export const deleteUserInDB = async (userId: string) => {
  try {
    // Call Supabase to delete the user
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      return { 
        success: false, 
        error
      };
    }
    
    return {
      success: true,
      error: null
    };
  } catch (error: any) {
    console.error('Error in deleteUserInDB:', error);
    return { 
      success: false, 
      error: new Error(error.message || "Unknown error occurred")
    };
  }
};
