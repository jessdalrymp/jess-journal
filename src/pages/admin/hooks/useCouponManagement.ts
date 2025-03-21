import { useState, useEffect } from 'react';
import { supabase } from "../../../integrations/supabase/client";
import { useToast } from "../../../hooks/use-toast";
import { addDays, addWeeks, addMonths } from "date-fns";
import { useAdminStatus } from './useAdminStatus';

export interface CouponType {
  id: string;
  code: string;
  description: string | null;
  discount_percent: number | null;
  discount_amount: number | null;
  expires_at: string | null;
  max_uses: number | null;
  current_uses: number | null;
  is_active: boolean | null;
  is_unlimited: boolean | null;
}

export const useCouponManagement = () => {
  const { toast } = useToast();
  const { isAdmin, loading: adminLoading } = useAdminStatus();
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponType | null>(null);
  const [expiryType, setExpiryType] = useState<"fixed" | "duration">("fixed");
  const [durationValue, setDurationValue] = useState<number>(30);
  const [durationType, setDurationType] = useState<"days" | "weeks" | "months">("days");
  const [connectionError, setConnectionError] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_percent: 0,
    discount_amount: 0,
    expires_at: '',
    max_uses: 0,
    is_active: true,
    is_unlimited: false
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching coupons:', error);
        setConnectionError(true);
        toast({
          title: "Error fetching coupons",
          description: error.message || "Please try again later",
          variant: "destructive"
        });
        return;
      }
      
      setCoupons(data || []);
    } catch (error: any) {
      console.error('Error fetching coupons:', error);
      setConnectionError(true);
      toast({
        title: "Error fetching coupons",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
    
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete operation error:', error);
        toast({
          title: "Error deleting coupon",
          description: error.message || "Please try again later",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Coupon deleted",
        description: "The coupon has been successfully deleted",
      });
      
      fetchCoupons();
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Error deleting coupon",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    }
  };

  const calculateExpiryDate = (): string | null => {
    if (expiryType === "fixed") {
      return formData.expires_at ? new Date(formData.expires_at).toISOString() : null;
    } else {
      const now = new Date();
      let expiryDate: Date;
      
      switch (durationType) {
        case "days":
          expiryDate = addDays(now, durationValue);
          break;
        case "weeks":
          expiryDate = addWeeks(now, durationValue);
          break;
        case "months":
          expiryDate = addMonths(now, durationValue);
          break;
        default:
          expiryDate = addDays(now, durationValue);
      }
      
      return expiryDate.toISOString();
    }
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
      const expiryDate = calculateExpiryDate();
      
      const couponData = {
        code: formData.code,
        description: formData.description,
        discount_percent: formData.discount_percent || null,
        discount_amount: formData.discount_amount || null,
        expires_at: expiryDate,
        max_uses: formData.is_unlimited ? null : formData.max_uses || null,
        is_active: formData.is_active,
        is_unlimited: formData.is_unlimited
      };

      if (editingCoupon) {
        // Update existing coupon
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);

        if (error) {
          console.error('Update operation error:', error);
          toast({
            title: "Error updating coupon",
            description: error.message || "Please try again later",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Coupon updated",
          description: "The coupon has been successfully updated",
        });
      } else {
        // Add new coupon
        const { error } = await supabase
          .from('coupons')
          .insert(couponData);

        if (error) {
          console.error('Insert operation error:', error);
          toast({
            title: "Error adding coupon",
            description: error.message || "Please try again later",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Coupon added",
          description: "The new coupon has been successfully added",
        });
      }
      
      setIsDialogOpen(false);
      fetchCoupons();
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
