
import { useState } from 'react';
import { supabase } from "../../../../integrations/supabase/client";
import { useToast } from "../../../../hooks/use-toast";
import { CouponType, CouponFormData } from '../../types/coupons';
import { calculateExpiryDate } from '../../utils/couponUtils';
import { showErrorNotification } from '../../utils/notificationUtils';

export const useCouponOperations = (
  fetchCoupons: () => Promise<void>,
  onSuccess: () => void
) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const addCoupon = async (
    couponData: CouponFormData, 
    expiryDate: string | null
  ) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('coupons')
        .insert({
          code: couponData.code,
          description: couponData.description,
          discount_percent: couponData.discount_percent || null,
          discount_amount: couponData.discount_amount || null,
          expires_at: expiryDate,
          max_uses: couponData.is_unlimited ? null : couponData.max_uses || null,
          is_active: couponData.is_active,
          is_unlimited: couponData.is_unlimited
        });

      if (error) {
        console.error('Insert operation error:', error);
        showErrorNotification(
          toast,
          "Error adding coupon",
          error.message || "Please try again later"
        );
        return false;
      }
      
      toast({
        title: "Coupon added",
        description: "The new coupon has been successfully added",
      });
      
      onSuccess();
      fetchCoupons();
      return true;
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      showErrorNotification(
        toast,
        "Error saving coupon",
        error.message || "Please try again later"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCoupon = async (
    couponId: string,
    couponData: CouponFormData,
    expiryDate: string | null
  ) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('coupons')
        .update({
          code: couponData.code,
          description: couponData.description,
          discount_percent: couponData.discount_percent || null,
          discount_amount: couponData.discount_amount || null,
          expires_at: expiryDate,
          max_uses: couponData.is_unlimited ? null : couponData.max_uses || null,
          is_active: couponData.is_active,
          is_unlimited: couponData.is_unlimited
        })
        .eq('id', couponId);

      if (error) {
        console.error('Update operation error:', error);
        showErrorNotification(
          toast,
          "Error updating coupon",
          error.message || "Please try again later"
        );
        return false;
      }
      
      toast({
        title: "Coupon updated",
        description: "The coupon has been successfully updated",
      });
      
      onSuccess();
      fetchCoupons();
      return true;
    } catch (error: any) {
      console.error('Error updating coupon:', error);
      showErrorNotification(
        toast,
        "Error updating coupon",
        error.message || "Please try again later"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete operation error:', error);
        showErrorNotification(
          toast,
          "Error deleting coupon",
          error.message || "Please try again later"
        );
        return false;
      }
      
      toast({
        title: "Coupon deleted",
        description: "The coupon has been successfully deleted",
      });
      
      fetchCoupons();
      return true;
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      showErrorNotification(
        toast,
        "Error deleting coupon",
        error.message || "Please try again later"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addCoupon,
    updateCoupon,
    deleteCoupon
  };
};
