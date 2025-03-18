
import { useState } from 'react';
import { supabase } from "../../../integrations/supabase/client";
import { useToast } from "../../../hooks/use-toast";
import { PlanType, PlanFormData } from "../types/plans";

export const usePlanOperations = (
  fetchPlans: () => Promise<void>,
  isAdmin: boolean | null
) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanType | null>(null);
  
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    description: '',
    price: 0,
    interval: 'month',
    is_active: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (plan: PlanType) => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can edit plans",
        variant: "destructive"
      });
      return;
    }
    
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
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can add plans",
        variant: "destructive"
      });
      return;
    }
    
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
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can delete plans",
        variant: "destructive"
      });
      return;
    }
    
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      const { error } = await supabase
        .from('payment_plans')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete operation error:', error);
        throw error;
      }
      
      toast({
        title: "Plan deleted",
        description: "The plan has been successfully deleted",
      });
      
      fetchPlans();
    } catch (error: any) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error deleting plan",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can modify plans",
        variant: "destructive"
      });
      return;
    }
    
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

        if (error) {
          console.error('Update operation error:', error);
          throw error;
        }
        
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

        if (error) {
          console.error('Insert operation error:', error);
          throw error;
        }
        
        toast({
          title: "Plan added",
          description: "The new plan has been successfully added",
        });
      }
      
      setIsDialogOpen(false);
      fetchPlans();
    } catch (error: any) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error saving plan",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingPlan,
    formData,
    handleInputChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSubmit
  };
};
