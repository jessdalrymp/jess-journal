import React from 'react';
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "../../../components/ui/dialog";
import type { CouponType } from '../hooks/coupons/types';

interface CouponFormHeaderProps {
  editingCoupon: CouponType | null;
}

export const CouponFormHeader: React.FC<CouponFormHeaderProps> = ({
  editingCoupon
}) => {
  return (
    <DialogHeader>
      <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
      <DialogDescription>
        {editingCoupon 
          ? 'Update the details of the existing coupon.' 
          : 'Create a new discount coupon.'}
      </DialogDescription>
    </DialogHeader>
  );
};
