
import { useState, useEffect } from 'react';
import { useToast } from "../../../hooks/use-toast";
import { CouponType, CouponFormData } from "./coupons/types";
import { fetchCoupons, deleteCoupon, saveCoupon, formatCouponFormData } from "./coupons/couponApi";
import { getInitialFormData, couponToFormData, handleInputChange as processInputChange } from "./coupons/formUtils";

export type { CouponType, CouponFormData };

export const useCouponManagement = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponType | null>(null);
  const [formData, setFormData] = useState<CouponFormData>(getInitialFormData());

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await fetchCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: "Error fetching coupons",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    processInputChange(e, setFormData);
  };

  const handleEdit = (coupon: CouponType) => {
    setEditingCoupon(coupon);
    setFormData(couponToFormData(coupon));
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCoupon(null);
    setFormData(getInitialFormData());
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await deleteCoupon(id);
      
      toast({
        title: "Coupon deleted",
        description: "The coupon has been successfully deleted",
      });
      
      loadCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Error deleting coupon",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const couponData = formatCouponFormData(formData);

      await saveCoupon(couponData, editingCoupon?.id);
      
      toast({
        title: editingCoupon ? "Coupon updated" : "Coupon added",
        description: editingCoupon 
          ? "The coupon has been successfully updated"
          : "The new coupon has been successfully added",
      });
      
      setIsDialogOpen(false);
      loadCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast({
        title: "Error saving coupon",
        description: "Please try again later",
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
    handleSubmit
  };
};
