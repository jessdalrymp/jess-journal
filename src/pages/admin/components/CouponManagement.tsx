
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "../../../components/ui/dialog";
import { Plus } from "lucide-react";
import { useCouponManagement } from './coupons/useCouponManagement';
import { CouponList } from './coupons/CouponList';
import { CouponForm } from './coupons/CouponForm';

export const CouponManagement = () => {
  const { 
    coupons, 
    loading, 
    isDialogOpen, 
    setIsDialogOpen, 
    editingCoupon, 
    formData, 
    handleInputChange,
    handleSwitchChange,
    handleEdit, 
    handleDuplicate,
    handleAdd, 
    generateRandomCode,
    handleDelete, 
    handleSubmit 
  } = useCouponManagement();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Coupon Management</CardTitle>
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
          <CouponList 
            coupons={coupons} 
            onEdit={handleEdit} 
            onDuplicate={handleDuplicate}
            onDelete={handleDelete} 
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
              <DialogDescription>
                {editingCoupon 
                  ? 'Update the details of the existing coupon.' 
                  : 'Create a new discount coupon.'}
              </DialogDescription>
            </DialogHeader>
            
            <CouponForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSwitchChange={handleSwitchChange}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
              onGenerateCode={generateRandomCode}
              isEditing={!!editingCoupon}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
