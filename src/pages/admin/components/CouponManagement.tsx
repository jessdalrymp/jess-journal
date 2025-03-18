
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "../../../components/ui/dialog";
import { Plus, Tag } from "lucide-react";
import { CouponTable } from './CouponTable';
import { CouponForm } from './CouponForm';
import { useCouponManagement } from '../hooks/useCouponManagement';

export const CouponManagement = () => {
  const {
    coupons,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    editingCoupon,
    formData,
    handleInputChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSubmit
  } = useCouponManagement();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Tag size={20} className="mr-2" />
              Coupon Management
            </CardTitle>
            <CardDescription>Manage discount coupons</CardDescription>
          </div>
          <Button onClick={handleAdd} size="sm">
            <Plus size={16} className="mr-2" />
            Add Coupon
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-4 text-jess-muted">No coupons found. Create your first coupon.</div>
        ) : (
          <CouponTable
            coupons={coupons}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <CouponForm
              formData={formData}
              editingCoupon={editingCoupon}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
