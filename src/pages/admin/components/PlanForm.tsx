
import React from 'react';
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "../../../components/ui/dialog";
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
      <DialogHeader>
        <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
        <DialogDescription>
          {editingPlan 
            ? 'Update the details of the existing plan.' 
            : 'Create a new subscription plan.'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="price">Price (in cents)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={onInputChange}
              required
            />
            <p className="text-xs text-jess-muted">Enter price in cents (e.g., 1499 for $14.99)</p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="interval">Billing Interval</Label>
            <select 
              id="interval"
              name="interval"
              value={formData.interval}
              onChange={onInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-jess-subtle px-3 py-2"
              required
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
              <option value="week">Weekly</option>
              <option value="day">Daily</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={onInputChange}
              className="h-4 w-4"
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {editingPlan ? 'Update Plan' : 'Add Plan'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
