
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { CouponForm } from "./CouponForm";
import { CouponFormData, CouponType } from "./types";

interface CouponDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CouponFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  editingCoupon: CouponType | null;
}

export const CouponDialog = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSwitchChange,
  onSubmit,
  editingCoupon
}: CouponDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
          <DialogDescription>
            {editingCoupon 
              ? 'Update the details of the existing coupon.' 
              : 'Create a new discount coupon.'}
          </DialogDescription>
        </DialogHeader>
        
        <CouponForm 
          formData={formData}
          onInputChange={onInputChange}
          onSwitchChange={onSwitchChange}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isEditing={!!editingCoupon}
        />
      </DialogContent>
    </Dialog>
  );
};
