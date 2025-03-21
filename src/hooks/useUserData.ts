
import { useEffect } from 'react';
import { useUserDataCore } from './useUserDataCore';
import { useProfileOperations } from './useProfileOperations';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';

export function useUserData() {
  const { 
    user, 
    profile, 
    loading, 
    fetchUser, 
    fetchProfile,
    toast
  } = useUserDataCore();
  
  const { saveProfile } = useProfileOperations();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  // Add coupon application and subscription check functionality
  const applyCoupon = async (couponCode: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to apply a coupon",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('apply-coupon', {
        body: { userId: user.id, couponCode }
      });

      if (error || !data?.success) {
        console.error('Error applying coupon:', error || data?.error);
        toast({
          title: "Coupon Error",
          description: data?.error || "Failed to apply coupon. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Coupon applied successfully!"
      });
      return true;
    } catch (error: any) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase.rpc('get_subscription_status');
      
      if (error) {
        console.error('Error checking subscription status:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return null;
    }
  };

  return {
    user,
    profile,
    loading,
    fetchUser,
    fetchProfile,
    saveProfile,
    applyCoupon,
    checkSubscriptionStatus
  };
}
