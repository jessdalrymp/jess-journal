
import { useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Subscription } from "../context/types";

export function useSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkSubscriptionStatus = async () => {
    if (!userId) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching subscription:", error);
        return null;
      }
      
      const subscription: Subscription = {
        id: data.id,
        status: data.status,
        is_trial: data.is_trial,
        is_unlimited: data.is_unlimited,
        trial_ends_at: data.trial_ends_at,
        current_period_ends_at: data.current_period_ends_at,
        coupon_code: data.coupon_code
      };
      
      setSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

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
        
        // Refresh subscription status
        await checkSubscriptionStatus();
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
