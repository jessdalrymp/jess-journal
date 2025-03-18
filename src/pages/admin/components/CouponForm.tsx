import React from 'react';
import { CouponFormHeader } from './CouponFormHeader';
import { CouponFormFields } from './CouponFormFields';
import { CouponFormActions } from './CouponFormActions';
import type { CouponFormData, CouponType } from '../hooks/coupons/types';

interface CouponFormProps {
  formData: CouponFormData;
  editingCoupon: CouponType | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CouponForm: React.FC<CouponFormProps> = ({
  formData,
  editingCoupon,
  onInputChange,
  onSubmit,
  onCancel
}) => {
  return (
    <>
      <CouponFormHeader editingCoupon={editingCoupon} />
      
      <form onSubmit={onSubmit}>
        <CouponFormFields 
          formData={formData} 
          onInputChange={onInputChange} 
        />
        
        <CouponFormActions 
          editingCoupon={editingCoupon} 
          onCancel={onCancel} 
        />
      </form>
    </>
  );
};
