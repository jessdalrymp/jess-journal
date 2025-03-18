
import React from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';

interface UserActionsProps {
  userId: string;
  isAdmin: boolean;
  onToggleAdmin: (userId: string, currentStatus: boolean) => Promise<void>;
  onApplyCoupon: (userId: string, couponCode: string) => void;
}

export const UserActions: React.FC<UserActionsProps> = ({
  userId,
  isAdmin,
  onToggleAdmin,
  onApplyCoupon
}) => {
  const handleCouponSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const couponInput = form.elements.namedItem('coupon') as HTMLInputElement;
    
    if (couponInput && couponInput.value) {
      onApplyCoupon(userId, couponInput.value);
      couponInput.value = ''; // Clear the input after submission
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Switch 
          checked={isAdmin} 
          onCheckedChange={() => onToggleAdmin(userId, isAdmin)}
        />
      </div>
      <form 
        onSubmit={handleCouponSubmit} 
        className="flex gap-2"
      >
        <Input 
          type="text" 
          name="coupon" 
          placeholder="Coupon code" 
          className="w-28"
        />
        <Button type="submit" size="sm">Apply</Button>
      </form>
    </div>
  );
};
