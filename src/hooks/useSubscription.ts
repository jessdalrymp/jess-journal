
import { useState } from 'react';
import { Subscription } from '../context/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

  const checkSubscriptionStatus = async (userId?: string) => {
    if (!userId) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 means no rows returned
          console.error('Error checking subscription:', error);
        }
        setSubscription(null);
        return null;
      }

      // Transform raw data to our Subscription type
      const subscriptionData: Subscription = {
        id: data.id,
        status: data.status,
        is_trial: data.is_trial || false,
        is_unlimited: data.is_unlimited || false,
        trial_ends_at: data.trial_ends_at,
        current_period_ends_at: data.current_period_ends_at,
        coupon_code: data.coupon_code
      };
      
      setSubscription(subscriptionData);
      return subscriptionData;
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      toast({
        title: "Error checking subscription",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (userId: string, couponCode: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('apply-coupon', {
        body: { userId, couponCode }
      });

      if (error || !data?.valid) {
        console.error('Error applying coupon:', error || data?.error);
        return false;
      }

      // Refresh subscription after applying coupon
      await checkSubscriptionStatus(userId);
      return true;
    } catch (error) {
      console.error('Error applying coupon:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    subscription,
    checkSubscriptionStatus,
    applyCoupon,
  };
}
