
export interface CouponType {
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

export interface CouponFormData {
  code: string;
  description: string;
  discount_percent: number;
  discount_amount: number;
  expires_at: string;
  max_uses: number;
  is_active: boolean;
  is_unlimited: boolean;
}
