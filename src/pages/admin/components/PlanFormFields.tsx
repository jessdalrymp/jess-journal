
import React from 'react';
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import type { PlanFormData } from '../hooks/usePlanManagement';

interface PlanFormFieldsProps {
  formData: PlanFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const PlanFormFields: React.FC<PlanFormFieldsProps> = ({
  formData,
  onInputChange,
}) => {
  return (
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
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => {
            const event = {
              target: {
                name: "is_active",
                type: "checkbox",
                checked
              }
            } as React.ChangeEvent<HTMLInputElement>;
            onInputChange(event);
          }}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>
    </div>
  );
};
