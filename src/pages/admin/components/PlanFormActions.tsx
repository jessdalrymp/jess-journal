
import React from 'react';
import { Button } from "../../../components/ui/button";
import { DialogFooter } from "../../../components/ui/dialog";
import type { PlanType } from '../hooks/usePlanManagement';

interface PlanFormActionsProps {
  editingPlan: PlanType | null;
  onCancel: () => void;
}

export const PlanFormActions: React.FC<PlanFormActionsProps> = ({
  editingPlan,
  onCancel
}) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {editingPlan ? 'Update Plan' : 'Add Plan'}
      </Button>
    </DialogFooter>
  );
};
