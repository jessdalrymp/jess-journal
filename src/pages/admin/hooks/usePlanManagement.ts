
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
    createPlan,
    createSamplePlans: apiCreateSamplePlans
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
    setLoading(true);
    const planData = await fetchPlans();
    setPlans(planData);
    setLoading(false);
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

  const createSamplePlans = async () => {
    setLoading(true);
    const success = await apiCreateSamplePlans();
    if (success) {
      loadPlans();
    }
    setLoading(false);
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
    handleSubmit,
    createSamplePlans
  };
};

export type { PlanType, PlanFormData };
