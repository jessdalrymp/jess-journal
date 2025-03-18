
import { supabase } from "../../../../integrations/supabase/client";
import { CouponType, CouponFormData } from "./types";

export const fetchCoupons = async () => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const deleteCoupon = async (id: string) => {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const saveCoupon = async (couponData: Partial<CouponType>, id?: string) => {
  if (id) {
    // Update existing coupon
    const { error } = await supabase
      .from('coupons')
      .update(couponData)
      .eq('id', id);

    if (error) throw error;
  } else {
    // Add new coupon
    const { error } = await supabase
      .from('coupons')
      .insert(couponData);

    if (error) throw error;
  }
};

export const formatCouponFormData = (formData: CouponFormData) => {
  return {
    code: formData.code,
    description: formData.description,
    discount_percent: formData.discount_percent || null,
    discount_amount: formData.discount_amount || null,
    expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
    max_uses: formData.is_unlimited ? null : formData.max_uses || null,
    is_active: formData.is_active,
    is_unlimited: formData.is_unlimited
  };
};
