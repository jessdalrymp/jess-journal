import React from 'react';
import { Button } from "../../../components/ui/button";
import { DialogFooter } from "../../../components/ui/dialog";
import type { CouponType } from '../hooks/coupons/types';

interface CouponFormActionsProps {
  editingCoupon: CouponType | null;
  onCancel: () => void;
}

export const CouponFormActions: React.FC<CouponFormActionsProps> = ({
  editingCoupon,
  onCancel
}) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
      </Button>
    </DialogFooter>
  );
};
