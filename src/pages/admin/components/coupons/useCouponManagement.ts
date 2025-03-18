
import { useState, useEffect } from 'react';
import { supabase } from "../../../../integrations/supabase/client";
import { useToast } from "../../../../hooks/use-toast";

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

export interface CouponFormData {
  code: string;
  description: string;
  discount_percent: number;
  discount_amount: number;
  expires_at: string;
  max_uses: number;
  is_active: boolean;
  is_unlimited: boolean;
}

export function useCouponManagement() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponType | null>(null);
  
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

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleEdit = (coupon: CouponType) => {
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
    setIsDialogOpen(true);
  };

  const handleDuplicate = (coupon: CouponType) => {
    setEditingCoupon(null);
    const newCode = `${coupon.code}_COPY`;
    setFormData({
      code: newCode,
      description: coupon.description || '',
      discount_percent: coupon.discount_percent || 0,
      discount_amount: coupon.discount_amount || 0,
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : '',
      max_uses: coupon.max_uses || 0,
      is_active: true,
      is_unlimited: coupon.is_unlimited || false
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
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
    setIsDialogOpen(true);
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    const length = 8;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const response = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (response.error) throw response.error;
      
      toast({
        title: "Coupon deleted",
        description: "The coupon has been successfully deleted",
      });
      
      fetchCoupons();
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
      const couponData = {
        code: formData.code,
        description: formData.description,
        discount_percent: formData.discount_percent || null,
        discount_amount: formData.discount_amount || null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        max_uses: formData.is_unlimited ? null : formData.max_uses || null,
        is_active: formData.is_active,
        is_unlimited: formData.is_unlimited
      };

      if (editingCoupon) {
        // Update existing coupon
        const response = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);

        if (response.error) throw response.error;
        
        toast({
          title: "Coupon updated",
          description: "The coupon has been successfully updated",
        });
      } else {
        // Add new coupon
        const response = await supabase
          .from('coupons')
          .insert(couponData);

        if (response.error) throw response.error;
        
        toast({
          title: "Coupon added",
          description: "The new coupon has been successfully added",
        });
      }
      
      setIsDialogOpen(false);
      fetchCoupons();
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
    handleSwitchChange,
    handleEdit,
    handleDuplicate,
    handleAdd,
    generateRandomCode,
    handleDelete,
    handleSubmit
  };
}
