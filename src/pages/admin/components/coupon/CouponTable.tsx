
import React from 'react';
import { Button } from "../../../../components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

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

interface CouponTableProps {
  coupons: CouponType[];
  onEdit: (coupon: CouponType) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  isAdmin: boolean | null;
}

export const CouponTable = ({ coupons, onEdit, onDelete, loading, isAdmin }: CouponTableProps) => {
  if (loading) {
    return <div className="text-center py-4">Loading coupons...</div>;
  }
  
  if (coupons.length === 0) {
    return <div className="text-center py-4 text-jess-muted">No coupons found. Create your first coupon.</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-jess-subtle">
            <th className="px-4 py-2 text-left">Code</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Discount</th>
            <th className="px-4 py-2 text-left">Expires</th>
            <th className="px-4 py-2 text-left">Usage</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(coupon => (
            <tr key={coupon.id} className="border-b border-jess-subtle">
              <td className="px-4 py-3 font-medium">{coupon.code}</td>
              <td className="px-4 py-3">{coupon.description || '-'}</td>
              <td className="px-4 py-3">
                {coupon.discount_percent ? `${coupon.discount_percent}%` : ''}
                {coupon.discount_amount ? `$${(coupon.discount_amount / 100).toFixed(2)}` : ''}
                {!coupon.discount_percent && !coupon.discount_amount ? 'Special' : ''}
              </td>
              <td className="px-4 py-3">
                {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
              </td>
              <td className="px-4 py-3">
                {coupon.is_unlimited 
                  ? 'Unlimited' 
                  : `${coupon.current_uses || 0} / ${coupon.max_uses || 'Unlimited'}`}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {coupon.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(coupon)}
                    disabled={isAdmin === false}
                    title={isAdmin === false ? "Admin permission required" : "Edit coupon"}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(coupon.id)}
                    disabled={isAdmin === false}
                    title={isAdmin === false ? "Admin permission required" : "Delete coupon"}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
