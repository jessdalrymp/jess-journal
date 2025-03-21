
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
    // First check if the user is an admin using RPC
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('check_is_admin');
    
    if (adminCheckError) {
      console.error('Error checking admin status:', adminCheckError);
      return { 
        data: null, 
        error: new Error(`Failed to verify admin privileges. ${adminCheckError.message}`), 
        connectionError: true 
      };
    }
    
    if (!isAdmin) {
      console.warn('Non-admin user attempted to access payment_plans table');
      return { 
        data: null, 
        error: new Error("Permission denied. Admin access required to view payment plans."), 
        connectionError: true 
      };
    }
    
    // If we get here, the user is an admin and should have access to the table
    // Use a more permissive access method with the service role (if available)
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
