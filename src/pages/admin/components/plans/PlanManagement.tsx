
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "../../../../components/ui/dialog";
import { Plus } from "lucide-react";
import { usePlanManagement } from './usePlanManagement';
import { PlanTable } from './PlanTable';
import { PlanForm } from './PlanForm';

export const PlanManagement = () => {
  const {
    plans,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    formData,
    editingPlan,
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
        {loading ? (
          <div className="text-center py-4">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-4 text-jess-muted">No plans found. Create your first plan.</div>
        ) : (
          <PlanTable
            plans={plans}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
              <DialogDescription>
                {editingPlan 
                  ? 'Update the details of the existing plan.' 
                  : 'Create a new subscription plan.'}
              </DialogDescription>
            </DialogHeader>
            
            <PlanForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
              isEditing={!!editingPlan}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
