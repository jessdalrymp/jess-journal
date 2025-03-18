
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

  // Fixed: Split into multiple handlers to avoid type instantiation issues
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setFormData(prev => ({ ...prev, [name]: e.target.checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setFormData(prev => ({ ...prev, [name]: parseFloat(e.target.value) || 0 }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  // Main input handler that routes to specific handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLInputElement) {
      if (e.target.type === 'checkbox') {
        handleCheckboxChange(e as React.ChangeEvent<HTMLInputElement>);
      } else if (e.target.type === 'number' || e.target.name === 'price') {
        handleNumberChange(e as React.ChangeEvent<HTMLInputElement>);
      } else {
        handleTextChange(e);
      }
    } else {
      handleTextChange(e);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      // First check if any payments reference this plan
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('id')
        .eq('payment_plan_id', id)
        .limit(1);
        
      if (paymentError) throw paymentError;
      
      if (paymentData && paymentData.length > 0) {
        toast({
          title: "Cannot delete plan",
          description: "This plan is referenced by existing payments. Consider deactivating it instead.",
          variant: "destructive"
        });
        return;
      }
      
      // If no payments reference this plan, proceed with deletion
      const { error } = await supabase
        .from('payment_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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
        // Update existing plan
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
        // Add new plan
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
