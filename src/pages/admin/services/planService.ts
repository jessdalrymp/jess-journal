
import { supabase } from "../../../integrations/supabase/client";
import { PlanType } from "../types/plans";

/**
 * Fetches all payment plans from the database
 * @returns An object containing plans data and any error that occurred
 */
export const fetchPlansFromDB = async (): Promise<{
  data: PlanType[] | null;
  error: Error | null;
  connectionError: boolean;
}> => {
  try {
    // Check if the table exists first
    const { count, error: countError } = await supabase
      .from('payment_plans')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking payment_plans table:', countError);
      
      // Check if this is a permission error (common for non-admin users)
      const isPermissionError = 
        countError.message.includes('permission denied') || 
        countError.message.includes('not found') ||
        countError.message === "";  // Empty error message often indicates permission issue
      
      return { 
        data: null, 
        error: new Error(
          isPermissionError 
            ? "Permission denied. Admin access required to view payment plans." 
            : countError.message
        ), 
        connectionError: true 
      };
    }
    
    const { data, error } = await supabase
      .from('payment_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching plans:', error);
      return { 
        data: null, 
        error, 
        connectionError: true 
      };
    }
    
    return { data, error: null, connectionError: false };
  } catch (error: any) {
    console.error('Error in fetchPlansFromDB:', error);
    return { 
      data: null, 
      error: new Error(error.message || "Unknown error occurred"), 
      connectionError: true 
    };
  }
};
