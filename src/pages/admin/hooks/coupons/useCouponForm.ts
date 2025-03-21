
import { useState } from 'react';
import { CouponFormData, CouponType, ExpiryType, DurationType } from '../../types/coupons';

export const useCouponForm = (editingCoupon: CouponType | null) => {
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    description: '',
    discount_percent: 0,
    discount_amount: 0,
    expires_at: '',
    max_uses: 0,
    is_active: true,
    is_unlimited: false
  });
  const [expiryType, setExpiryType] = useState<ExpiryType>("fixed");
  const [durationValue, setDurationValue] = useState<number>(30);
  const [durationType, setDurationType] = useState<DurationType>("days");

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_percent: 0,
      discount_amount: 0,
      expires_at: '',
      max_uses: 0,
      is_active: true,
      is_unlimited: false
    });
    setExpiryType("fixed");
    setDurationValue(30);
    setDurationType("days");
  };

  const setEditingCoupon = (coupon: CouponType) => {
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_percent: coupon.discount_percent || 0,
      discount_amount: coupon.discount_amount || 0,
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : '',
      max_uses: coupon.max_uses || 0,
      is_active: coupon.is_active || false,
      is_unlimited: coupon.is_unlimited || false
    });
    setExpiryType(coupon.expires_at ? "fixed" : "duration");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'discount_percent' || name === 'discount_amount' || name === 'max_uses') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return {
    formData,
    expiryType,
    setExpiryType,
    durationValue,
    setDurationValue,
    durationType,
    setDurationType,
    handleInputChange,
    resetForm,
    setEditingCoupon
  };
};
