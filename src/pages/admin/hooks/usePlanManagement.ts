
import { useState, useEffect, useCallback } from 'react';
import { usePlanApi } from './plans/planApi';
import { useFormHandling } from './plans/useFormHandling';
import type { PlanType, PlanFormData } from './plans/types';

export const usePlanManagement = () => {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    fetchPlans,
    deletePlan,
    updatePlan,
    createPlan
  } = usePlanApi();
  
  const {
    isDialogOpen,
    setIsDialogOpen,
    editingPlan,
    formData,
    handleInputChange,
    handleEdit,
    handleAdd
  } = useFormHandling();

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const planData = await fetchPlans();
      setPlans(planData);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchPlans]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    const success = await deletePlan(id);
    if (success) {
      loadPlans();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success;
    if (editingPlan) {
      // Update existing plan
      success = await updatePlan(editingPlan.id, {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        interval: formData.interval,
        is_active: formData.is_active
      });
    } else {
      // Add new plan
      success = await createPlan({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        interval: formData.interval,
        is_active: formData.is_active
      });
    }
    
    if (success) {
      setIsDialogOpen(false);
      loadPlans();
    }
  };

  return {
    plans,
    loading,
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

export type { PlanType, PlanFormData };
