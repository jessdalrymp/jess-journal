
/**
 * Generates a random coupon code of the specified length
 */
export const generateRandomCode = (length: number = 8): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like 0,O,1,I
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const formatCouponDiscount = (
  discountPercent: number | null,
  discountAmount: number | null
): string => {
  if (discountPercent) return `${discountPercent}%`;
  if (discountAmount) return `$${(discountAmount / 100).toFixed(2)}`;
  return 'Special';
};
