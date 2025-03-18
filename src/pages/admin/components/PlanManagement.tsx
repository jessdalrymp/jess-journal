
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { PlanTable } from "./plan/PlanTable";
import { PlanFormDialog } from "./plan/PlanFormDialog";
import { usePlanManagement } from "../hooks/usePlanManagement";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";

export const PlanManagement = () => {
  const {
    plans,
    loading,
    isAdmin,
    isDialogOpen,
    setIsDialogOpen,
    editingPlan,
    formData,
    handleInputChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSubmit
  } = usePlanManagement();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payment Plans</CardTitle>
            <CardDescription>Manage subscription plans</CardDescription>
          </div>
          <Button onClick={handleAdd} size="sm">
            <Plus size={16} className="mr-2" />
            Add Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdmin === false && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Admin Access Required</AlertTitle>
            <AlertDescription>
              You must be an administrator to create, update, or delete payment plans.
              You can still view existing plans.
            </AlertDescription>
          </Alert>
        )}
        
        <PlanTable
          plans={plans}
          loading={loading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          isAdmin={isAdmin}
        />

        <PlanFormDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isEditing={!!editingPlan}
        />
      </CardContent>
    </Card>
  );
};
