import { useState } from 'react';
import { useToast } from "../../../hooks/use-toast";
import { useAdminStatus } from './useAdminStatus';
import { calculateExpiryDate } from '../utils/couponUtils';
import { useCouponForm } from './coupons/useCouponForm';
import { useCouponOperations } from './coupons/useCouponOperations';
import { useCouponFetching } from './coupons/useCouponFetching';
import { CouponType } from '../types/coupons';

export type { CouponType } from '../types/coupons';

export const useCouponManagement = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdminStatus();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponType | null>(null);
  
  const {
    coupons,
    loading: fetchLoading,
    connectionError,
    fetchCoupons
  } = useCouponFetching();
  
  const {
    formData,
    expiryType,
    setExpiryType,
    durationValue,
    setDurationValue,
    durationType,
    setDurationType,
    handleInputChange,
    resetForm,
    setEditingCoupon: populateFormWithCoupon
  } = useCouponForm(editingCoupon);
  
  const {
    loading: operationLoading,
    addCoupon,
    updateCoupon,
    deleteCoupon
  } = useCouponOperations(fetchCoupons, () => setIsDialogOpen(false));

  const loading = fetchLoading || operationLoading;

  const handleEdit = (coupon: CouponType) => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can edit coupons",
        variant: "destructive"
      });
      return;
    }
    
    setEditingCoupon(coupon);
    populateFormWithCoupon(coupon);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can add coupons",
        variant: "destructive"
      });
      return;
    }
    
    setEditingCoupon(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can delete coupons",
        variant: "destructive"
      });
      return;
    }
    
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    await deleteCoupon(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can modify coupons",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const expiryDate = calculateExpiryDate(
        expiryType,
        formData.expires_at,
        durationValue,
        durationType
      );
      
      if (editingCoupon) {
        // Update existing coupon
        await updateCoupon(editingCoupon.id, formData, expiryDate);
      } else {
        // Add new coupon
        await addCoupon(formData, expiryDate);
      }
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      toast({
        title: "Error saving coupon",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    }
  };

  return {
    coupons,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    editingCoupon,
    formData,
    handleInputChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSubmit,
    expiryType,
    setExpiryType,
    durationValue,
    setDurationValue,
    durationType,
    setDurationType,
    isAdmin,
    connectionError
  };
};
