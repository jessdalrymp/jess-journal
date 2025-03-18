
import React from 'react';
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "../../../components/ui/dialog";
import type { PlanType } from '../hooks/usePlanManagement';

interface PlanFormHeaderProps {
  editingPlan: PlanType | null;
}

export const PlanFormHeader: React.FC<PlanFormHeaderProps> = ({
  editingPlan
}) => {
  return (
    <DialogHeader>
      <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
      <DialogDescription>
        {editingPlan 
          ? 'Update the details of the existing plan.' 
          : 'Create a new subscription plan.'}
      </DialogDescription>
    </DialogHeader>
  );
};
