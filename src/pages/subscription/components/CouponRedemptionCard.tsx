
import { useState } from "react";
import { CouponRedemption } from "../../../components/subscription/CouponRedemption";
import { useUserData } from "../../../context/UserDataContext";

export const CouponRedemptionCard = () => {
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { applyCoupon, checkSubscriptionStatus } = useUserData();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      const success = await applyCoupon(couponCode.trim());
      if (success) {
        setCouponCode("");
        await checkSubscriptionStatus();
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <CouponRedemption 
      couponCode={couponCode}
      setCouponCode={setCouponCode}
      handleApplyCoupon={handleApplyCoupon}
      isApplyingCoupon={isApplyingCoupon}
    />
  );
};
