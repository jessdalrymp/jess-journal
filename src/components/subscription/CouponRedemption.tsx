
import { Gift } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface CouponRedemptionProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  handleApplyCoupon: () => Promise<void>;
  isApplyingCoupon: boolean;
}

export const CouponRedemption = ({
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  isApplyingCoupon
}: CouponRedemptionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift size={20} className="mr-2" />
          Redeem Coupon
        </CardTitle>
        <CardDescription>
          Enter a coupon code to get special offers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="grid gap-2 flex-1">
            <Label htmlFor="couponCode">Coupon Code</Label>
            <Input 
              id="couponCode"
              placeholder="Enter coupon code" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>
          <div className="self-end">
            <Button 
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon || !couponCode.trim()}
              variant="outline"
            >
              {isApplyingCoupon ? 'Applying...' : 'Apply'}
            </Button>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Note: You may need to restart your session if the coupon doesn't apply immediately.
        </div>
      </CardContent>
    </Card>
  );
};
