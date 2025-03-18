
import React from 'react';
import { PlanFormHeader } from './PlanFormHeader';
import { PlanFormFields } from './PlanFormFields';
import { PlanFormActions } from './PlanFormActions';
import type { PlanFormData, PlanType } from '../hooks/usePlanManagement';

interface PlanFormProps {
  formData: PlanFormData;
  editingPlan: PlanType | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const PlanForm: React.FC<PlanFormProps> = ({
  formData,
  editingPlan,
  onInputChange,
  onSubmit,
  onCancel
}) => {
  return (
    <>
      <PlanFormHeader editingPlan={editingPlan} />
      
      <form onSubmit={onSubmit}>
        <PlanFormFields 
          formData={formData} 
          onInputChange={onInputChange} 
        />
        
        <PlanFormActions 
          editingPlan={editingPlan} 
          onCancel={onCancel} 
        />
      </form>
    </>
  );
};
