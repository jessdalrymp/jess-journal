
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";

interface PlanFormData {
  name: string;
  description: string;
  price: number;
  interval: string;
  is_active: boolean;
}

interface PlanFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: PlanFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isEditing: boolean;
}

export const PlanFormDialog: React.FC<PlanFormDialogProps> = ({
  isOpen,
  setIsOpen,
  formData,
  handleInputChange,
  handleSubmit,
  isEditing
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the details of the existing plan.' 
              : 'Create a new subscription plan.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">Price (in cents)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="h-4 w-4"
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Plan' : 'Add Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
