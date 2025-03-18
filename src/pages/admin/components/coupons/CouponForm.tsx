
import React from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Switch } from "../../../../components/ui/switch";
import { DialogFooter } from "../../../../components/ui/dialog";
import { CouponFormData } from "./types";
import { generateRandomCode } from "./utils";

interface CouponFormProps {
  formData: CouponFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const CouponForm = ({ 
  formData, 
  onInputChange, 
  onSwitchChange, 
  onSubmit,
  onCancel,
  isEditing
}: CouponFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={onInputChange}
                required
                className="mt-1"
              />
            </div>
            <div className="mt-7">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const randomCode = generateRandomCode();
                  // Update the input value programmatically
                  const codeInput = document.getElementById('code') as HTMLInputElement;
                  if (codeInput) {
                    codeInput.value = randomCode;
                    // Create and dispatch change event
                    const event = new Event('input', { bubbles: true });
                    codeInput.dispatchEvent(event);
                    // Trigger the onChange handler manually
                    onInputChange({
                      target: { name: 'code', value: randomCode }
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
              >
                Generate
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            rows={2}
            className="resize-none"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="discount_percent">Discount %</Label>
            <Input
              id="discount_percent"
              name="discount_percent"
              type="number"
              min="0"
              max="100"
              value={formData.discount_percent}
              onChange={onInputChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="discount_amount">Discount Amount (cents)</Label>
            <Input
              id="discount_amount"
              name="discount_amount"
              type="number"
              min="0"
              value={formData.discount_amount}
              onChange={onInputChange}
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="expires_at">Expiration Date</Label>
          <Input
            id="expires_at"
            name="expires_at"
            type="date"
            value={formData.expires_at}
            onChange={onInputChange}
          />
          <p className="text-xs text-jess-muted">Leave blank for no expiration</p>
        </div>
        
        <div className="flex items-center justify-between space-y-0 py-2">
          <Label htmlFor="is_unlimited">Unlimited Uses</Label>
          <Switch
            id="is_unlimited"
            checked={formData.is_unlimited}
            onCheckedChange={(checked) => onSwitchChange('is_unlimited', checked)}
          />
        </div>
        
        {!formData.is_unlimited && (
          <div className="grid gap-2">
            <Label htmlFor="max_uses">Maximum Uses</Label>
            <Input
              id="max_uses"
              name="max_uses"
              type="number"
              min="0"
              value={formData.max_uses}
              onChange={onInputChange}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between space-y-0 py-2">
          <Label htmlFor="is_active">Active</Label>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => onSwitchChange('is_active', checked)}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Coupon' : 'Add Coupon'}
        </Button>
      </DialogFooter>
    </form>
  );
};
