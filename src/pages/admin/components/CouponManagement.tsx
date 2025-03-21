
import React from 'react';
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { CouponTable } from "./coupon/CouponTable";
import { CouponFormDialog } from "./coupon/CouponFormDialog";
import { useCouponManagement } from "../hooks/useCouponManagement";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
    setDurationType,
    isAdmin,
    connectionError
  } = useCouponManagement();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Coupon Management</CardTitle>
            <CardDescription>Manage discount coupons</CardDescription>
          </div>
          <Button 
            onClick={handleAdd} 
            size="sm" 
            disabled={isAdmin === false || connectionError}
          >
            <Plus size={16} className="mr-2" />
            Add Coupon
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdmin === false && !connectionError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Admin Access Required</AlertTitle>
            <AlertDescription>
              You must be an administrator to create, update, or delete coupons.
              You can still view existing coupons.
            </AlertDescription>
          </Alert>
        )}

        {connectionError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Unable to connect to the coupons table. This could be due to permission issues.
            </AlertDescription>
          </Alert>
        )}
        
        <CouponTable 
          coupons={coupons}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          isAdmin={isAdmin}
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
