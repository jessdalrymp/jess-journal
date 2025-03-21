
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
    // Direct query approach with improved error handling
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coupons:', error);
      
      // Check if it's a permission error
      if (error.message.includes('permission denied') || error.code === '42501') {
        return { 
          data: null, 
          error: new Error("Permission denied. Admin access required to view coupons."), 
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
    console.error('Error in fetchCouponsFromDB:', error);
    return { 
      data: null, 
      error: new Error(error.message || "Unknown error occurred"), 
      connectionError: true 
    };
  }
};
