
import { useState, useEffect } from 'react';
import { supabase } from "../../../../integrations/supabase/client";
import { useToast } from "../../../../hooks/use-toast";
import { CouponType } from '../../types/coupons';
import { showErrorNotification } from '../../utils/notificationUtils';

export const useCouponFetching = () => {
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const { toast } = useToast();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching coupons:', error);
        setConnectionError(true);
        showErrorNotification(
          toast,
          "Error fetching coupons",
          error.message || "Please try again later"
        );
        return;
      }
      
      setCoupons(data || []);
    } catch (error: any) {
      console.error('Error fetching coupons:', error);
      setConnectionError(true);
      showErrorNotification(
        toast,
        "Error fetching coupons",
        "Please try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return {
    coupons,
    loading,
    connectionError,
    fetchCoupons
  };
};
