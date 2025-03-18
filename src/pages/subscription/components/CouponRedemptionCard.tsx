
import { useState } from "react";
import { CouponRedemption } from "../../../components/subscription/CouponRedemption";
import { useUserData } from "../../../context/UserDataContext";

export const CouponRedemptionCard = () => {
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { applyCoupon } = useUserData();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || isApplyingCoupon) return;

    setIsApplyingCoupon(true);
    try {
      // Apply the coupon and don't worry about refreshing subscription here
      // The UserDataProvider will handle that
      await applyCoupon(couponCode.trim());
      setCouponCode("");
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
