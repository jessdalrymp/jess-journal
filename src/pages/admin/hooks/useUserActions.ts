
import { useCallback } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import { useToast } from '../../../hooks/use-toast';

interface User {
  id: string;
  email: string;
  created_at: string;
  profile_data: any;
  subscription_data: any;
  is_admin: boolean;
}

export const useUserActions = (loadUsers: () => Promise<void>) => {
  const { toast } = useToast();

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Use type assertion to bypass TypeScript checking for RPC functions
      const { data, error } = await supabase.rpc(
        'toggle_user_admin_status',
        { p_user_id: userId, p_admin_status: !currentStatus }
      ) as any;
      
      if (error) {
        console.error('Error updating admin status:', error);
        toast({
          title: "Error updating admin status",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        // Refresh users
        await loadUsers();
        
        toast({
          title: "Admin status updated",
          description: `User is now ${!currentStatus ? 'an admin' : 'not an admin'}`,
        });
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast({
        title: "An unexpected error occurred",
        description: "Could not update admin status",
        variant: "destructive"
      });
    }
  };

  const applyCouponToUser = async (userId: string, couponCode: string) => {
    if (!couponCode.trim()) {
      toast({
        title: "Missing coupon code",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Use type assertion to bypass TypeScript checking for RPC functions
      const { data, error } = await supabase.rpc(
        'apply_coupon_to_user',
        { p_user_id: userId, p_coupon_code: couponCode.trim() }
      ) as any;
      
      if (error) {
        console.error('Error applying coupon:', error);
        toast({
          title: "Error applying coupon",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        // Refresh user data
        await loadUsers();
        
        toast({
          title: "Coupon applied successfully",
          description: `Coupon ${couponCode} has been applied to the user`,
        });
      } else {
        toast({
          title: "Coupon application failed",
          description: "The coupon could not be applied",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "An unexpected error occurred",
        description: "Could not apply coupon",
        variant: "destructive"
      });
    }
  };

  return {
    toggleAdminStatus,
    applyCouponToUser
  };
};
