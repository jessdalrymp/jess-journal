
import React from 'react';
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { CouponTable } from "./coupon/CouponTable";
import { CouponFormDialog } from "./coupon/CouponFormDialog";
import { useCouponManagement } from "../hooks/useCouponManagement";

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
    handleSubmit,
    expiryType,
    setExpiryType,
    durationValue,
    setDurationValue,
    durationType,
    setDurationType
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
        <CouponTable 
          coupons={coupons}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        <CouponFormDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          expiryType={expiryType}
          setExpiryType={setExpiryType}
          durationValue={durationValue}
          setDurationValue={setDurationValue}
          durationType={durationType}
          setDurationType={setDurationType}
          editingCoupon={editingCoupon}
        />
      </CardContent>
    </Card>
  );
};
