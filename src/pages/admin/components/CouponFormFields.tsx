
import React from 'react';
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import type { CouponFormData } from '../hooks/useCouponManagement';

interface CouponFormFieldsProps {
  formData: CouponFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const CouponFormFields: React.FC<CouponFormFieldsProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="code">Coupon Code</Label>
        <Input
          id="code"
          name="code"
          value={formData.code}
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
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_unlimited"
          name="is_unlimited"
          checked={formData.is_unlimited}
          onCheckedChange={(checked) => {
            const event = {
              target: {
                name: "is_unlimited",
                type: "checkbox",
                checked
              }
            } as React.ChangeEvent<HTMLInputElement>;
            onInputChange(event);
          }}
        />
        <Label htmlFor="is_unlimited">Unlimited Uses</Label>
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
