
import { useState, useEffect, useCallback } from 'react';
import { usePlanApi } from './plans/planApi';
import { useFormHandling } from './plans/useFormHandling';
import type { PlanType, PlanFormData } from './plans/types';

export const usePlanManagement = () => {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
    // Clear previous errors
    setError(null);
    
    try {
      // Only set loading to true on initial load
      if (!plans.length) {
        setLoading(true);
      }
      
      const planData = await fetchPlans();
      setPlans(planData);
    } catch (error) {
      console.error('Error loading plans:', error);
      setError('Failed to load plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [fetchPlans, plans.length]);

  // Only load plans once on component mount
  useEffect(() => {
    loadPlans();
    // Don't include loadPlans in dependency array to prevent infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    const success = await deletePlan(id);
    if (success) {
      // Update the local plans state directly instead of reloading
      setPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
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
      
      if (success) {
        // Update the local state directly
        setPlans(prevPlans => prevPlans.map(plan => 
          plan.id === editingPlan.id 
            ? { ...plan, ...formData, id: editingPlan.id } 
            : plan
        ));
      }
    } else {
      // Add new plan
      success = await createPlan({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        interval: formData.interval,
        is_active: formData.is_active
      });
      
      if (success) {
        // Reload plans to get the newly created plan with its ID
        loadPlans();
      }
    }
    
    if (success) {
      setIsDialogOpen(false);
    }
  };

  return {
    plans,
    loading,
    error,
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
