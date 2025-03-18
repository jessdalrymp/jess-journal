
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import { CouponList } from "./coupons/CouponList";
import { CouponDialog } from "./coupons/CouponDialog";
import { useCouponManagement } from "./coupons/useCouponManagement";

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
        ) : (
          <CouponList 
            coupons={coupons}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}

        <CouponDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          formData={formData}
          onInputChange={handleInputChange}
          onSwitchChange={handleSwitchChange}
          onSubmit={handleSubmit}
          editingCoupon={editingCoupon}
        />
      </CardContent>
    </Card>
  );
};
