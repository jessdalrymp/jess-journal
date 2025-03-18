
import React from 'react';
import { addDays, addWeeks, addMonths } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

interface CouponFormData {
  code: string;
  description: string;
  discount_percent: number;
  discount_amount: number;
  expires_at: string;
  max_uses: number;
  is_active: boolean;
  is_unlimited: boolean;
}

interface CouponType {
  id: string;
  code: string;
  description: string | null;
  discount_percent: number | null;
  discount_amount: number | null;
  expires_at: string | null;
  max_uses: number | null;
  current_uses: number | null;
  is_active: boolean | null;
  is_unlimited: boolean | null;
}

interface CouponFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: CouponFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  expiryType: "fixed" | "duration";
  setExpiryType: (type: "fixed" | "duration") => void;
  durationValue: number;
  setDurationValue: (value: number) => void;
  durationType: "days" | "weeks" | "months";
  setDurationType: (type: "days" | "weeks" | "months") => void;
  editingCoupon: CouponType | null;
}

export const CouponFormDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  formData,
  handleInputChange,
  expiryType,
  setExpiryType,
  durationValue,
  setDurationValue,
  durationType,
  setDurationType,
  editingCoupon
}: CouponFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
          <DialogDescription>
            {editingCoupon 
              ? 'Update the details of the existing coupon.' 
              : 'Create a new discount coupon.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Expiration Type</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="expiry-fixed"
                    type="radio"
                    name="expiry-type"
                    checked={expiryType === "fixed"}
                    onChange={() => setExpiryType("fixed")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="expiry-fixed">Fixed Date</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="expiry-duration"
                    type="radio"
                    name="expiry-type"
                    checked={expiryType === "duration"}
                    onChange={() => setExpiryType("duration")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="expiry-duration">Duration</Label>
                </div>
              </div>
            </div>
            
            {expiryType === "fixed" ? (
              <div className="grid gap-2">
                <Label htmlFor="expires_at">Expiration Date</Label>
                <Input
                  id="expires_at"
                  name="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-jess-muted">Leave blank for no expiration</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration-value">Duration</Label>
                  <Input
                    id="duration-value"
                    type="number"
                    min="1"
                    value={durationValue}
                    onChange={(e) => setDurationValue(parseInt(e.target.value) || 30)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration-type">Unit</Label>
                  <Select 
                    value={durationType} 
                    onValueChange={(value) => setDurationType(value as "days" | "weeks" | "months")}
                  >
                    <SelectTrigger id="duration-type">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <input
                  id="is_unlimited"
                  name="is_unlimited"
                  type="checkbox"
                  checked={formData.is_unlimited}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_unlimited">Unlimited Uses</Label>
              </div>
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
                  onChange={handleInputChange}
                />
              </div>
            )}
            
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
