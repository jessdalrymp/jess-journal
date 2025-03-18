
import { useState, useCallback } from "react";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Subscription } from "../context/types";

export function useSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkSubscriptionStatus = useCallback(async (): Promise<void> => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Add more detailed logging for debugging
      console.log("Fetching subscription for user:", userId);
      
      // Change request to not use .single() which requires exactly one row
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        console.error("Error fetching subscription:", error);
        toast({
          title: "Subscription data unavailable",
          description: "We couldn't load your subscription information. You may have limited access.",
          variant: "destructive"
        });
        return;
      }
      
      if (data && data.length > 0) {
        const subscriptionData = data[0];
        const subscription: Subscription = {
          id: subscriptionData.id,
          status: subscriptionData.status,
          is_trial: subscriptionData.is_trial,
          is_unlimited: subscriptionData.is_unlimited,
          trial_ends_at: subscriptionData.trial_ends_at,
          current_period_ends_at: subscriptionData.current_period_ends_at,
          coupon_code: subscriptionData.coupon_code
        };
        
        setSubscription(subscription);
        console.log("Subscription loaded successfully:", subscriptionData.status);
      } else {
        // User has no subscription yet
        setSubscription(null);
        console.log("No subscription found for user");
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      // Don't show error toast for every failed attempt to reduce user annoyance
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const applyCoupon = async (couponCode: string): Promise<boolean> => {
    if (!userId) {
      toast({
        title: "Error applying coupon",
        description: "You must be logged in to apply a coupon",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      console.log("Applying coupon:", couponCode);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/apply-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          userId,
          couponCode
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Error",
          description: result.error || "Could not apply coupon",
          variant: "destructive"
        });
        return false;
      }

      if (result.valid) {
        toast({
          title: "Success",
          description: "Coupon applied successfully"
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.error || "Invalid coupon code",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast({
        title: "Error",
        description: "Failed to apply coupon",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    loading,
    checkSubscriptionStatus,
    applyCoupon
  };
}
