
import { useState, useEffect } from 'react';
import { useToast } from "../../../../hooks/use-toast";
import { CouponType } from '../../types/coupons';
import { showErrorNotification } from '../../utils/notificationUtils';
import { fetchCouponsFromDB } from '../../services/couponService';

export const useCouponFetching = () => {
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const { toast } = useToast();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      
      const { data, error, connectionError } = await fetchCouponsFromDB();
      
      if (connectionError) {
        setConnectionError(true);
        
        // Only show error message if it's not a standard permission issue
        if (error && !error.message.includes("Permission denied")) {
          showErrorNotification(
            toast,
            "Error accessing coupons",
            error.message || "Please try again later"
          );
        }
        return;
      }
      
      if (error) {
        showErrorNotification(
          toast,
          "Error fetching coupons",
          error.message || "Please try again later"
        );
        return;
      }
      
      setCoupons(data || []);
    } catch (error: any) {
      console.error('Error in fetchCoupons:', error);
      setConnectionError(true);
      showErrorNotification(
        toast,
        "Error fetching coupons",
        error.message || "Please try again later"
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
