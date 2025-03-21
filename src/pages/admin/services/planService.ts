
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
    // Direct query approach with improved error handling
    const { data, error } = await supabase
      .from('payment_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching plans:', error);
      
      // Check if it's a permission error
      if (error.message.includes('permission denied') || error.code === '42501') {
        return { 
          data: null, 
          error: new Error("Permission denied. Admin access required to view payment plans."), 
          connectionError: true 
        };
      }
      
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
