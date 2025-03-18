
import { useState, useEffect } from 'react';
import { supabase } from "../../../../integrations/supabase/client";
import { useToast } from "../../../../hooks/use-toast";
import { PlanType, PlanFormData } from './types';

export const usePlanManagement = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanType | null>(null);
  
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    description: '',
    price: 0,
    interval: 'month',
    is_active: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error fetching plans",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNumberChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleTextChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    
    if (target instanceof HTMLInputElement) {
      if (target.type === 'checkbox') {
        handleCheckboxChange(name, target.checked);
      } else if (target.type === 'number' || name === 'price') {
        handleNumberChange(name, target.value);
      } else {
        handleTextChange(name, target.value);
      }
    } else {
      handleTextChange(name, target.value);
    }
  };

  const handleEdit = (plan: PlanType) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      interval: plan.interval,
      is_active: plan.is_active || false
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      interval: 'month',
      is_active: true
    });
    setIsDialogOpen(true);
  };

  // Fixed version with simplified typing to avoid deep type instantiation
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      // Check if any payments reference this plan, with explicit typing
      const result = await supabase
        .from('payments')
        .select('id')
        .eq('payment_plan_id', id)
        .limit(1);
      
      const paymentData = result.data;
      const paymentError = result.error;
        
      if (paymentError) throw paymentError;
      
      if (paymentData && paymentData.length > 0) {
        toast({
          title: "Cannot delete plan",
          description: "This plan is referenced by existing payments. Consider deactivating it instead.",
          variant: "destructive"
        });
        return;
      }
      
      const deleteResult = await supabase
        .from('payment_plans')
        .delete()
        .eq('id', id);

      if (deleteResult.error) throw deleteResult.error;
      
      toast({
        title: "Plan deleted",
        description: "The plan has been successfully deleted",
      });
      
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error deleting plan",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('payment_plans')
          .update({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            interval: formData.interval,
            is_active: formData.is_active
          })
          .eq('id', editingPlan.id);

        if (error) throw error;
        
        toast({
          title: "Plan updated",
          description: "The plan has been successfully updated",
        });
      } else {
        const { error } = await supabase
          .from('payment_plans')
          .insert({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            interval: formData.interval,
            is_active: formData.is_active
          });

        if (error) throw error;
        
        toast({
          title: "Plan added",
          description: "The new plan has been successfully added",
        });
      }
      
      setIsDialogOpen(false);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error saving plan",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return {
    plans,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    formData,
    editingPlan,
    handleInputChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSubmit
  };
};
