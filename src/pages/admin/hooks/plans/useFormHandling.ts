
import React, { useState } from 'react';
import { PlanFormData, PlanType } from './types';

export const useFormHandling = () => {
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      interval: 'month',
      is_active: true
    });
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
    resetForm();
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingPlan,
    formData,
    handleInputChange,
    handleEdit,
    handleAdd,
    resetForm
  };
};
