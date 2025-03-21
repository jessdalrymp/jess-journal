
import { supabase } from "../../../integrations/supabase/client";
import { CouponType } from "../types/coupons";

/**
 * Fetches all coupons from the database
 * @returns An object containing coupons data and any error that occurred
 */
export const fetchCouponsFromDB = async (): Promise<{
  data: CouponType[] | null;
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
        error: new Error("Failed to verify admin privileges."), 
        connectionError: true 
      };
    }
    
    if (!isAdmin) {
      console.warn('Non-admin user attempted to access coupons table');
      return { 
        data: null, 
        error: new Error("Permission denied. Admin access required to view coupons."), 
        connectionError: true 
      };
    }
    
    // Check if the table exists and user has permissions
    const { count, error: countError } = await supabase
      .from('coupons')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking coupons table:', countError);
      
      // Determine if this is a permission error
      const isPermissionError = 
        countError.message.includes('permission denied') || 
        countError.message.includes('not found') ||
        countError.message === "";  // Empty error message often indicates permission issue
      
      return { 
        data: null, 
        error: new Error(
          isPermissionError 
            ? "Permission denied. Admin access required to view coupons." 
            : countError.message
        ), 
        connectionError: true 
      };
    }
    
    // If we get here, the user is an admin and has access to the table
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coupons:', error);
      return { 
        data: null, 
        error, 
        connectionError: true 
      };
    }
    
    return { data, error: null, connectionError: false };
  } catch (error: any) {
    console.error('Error in fetchCouponsFromDB:', error);
    return { 
      data: null, 
      error: new Error(error.message || "Unknown error occurred"), 
      connectionError: true 
    };
  }
};
