
export interface PlanType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  is_active: boolean | null;
}

export interface PlanFormData {
  name: string;
  description: string;
  price: number;
  interval: string;
  is_active: boolean;
}
