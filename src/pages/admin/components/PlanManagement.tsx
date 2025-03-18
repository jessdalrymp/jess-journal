
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "../../../components/ui/dialog";
import { Plus } from "lucide-react";
import { PlanTable } from './PlanTable';
import { PlanForm } from './PlanForm';
import { usePlanManagement } from '../hooks/usePlanManagement';

export const PlanManagement = () => {
  const {
    plans,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    editingPlan,
    formData,
    handleInputChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSubmit,
    createSamplePlans
  } = usePlanManagement();

  console.log('Plans in PlanManagement:', plans); // Debug log

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payment Plans</CardTitle>
            <CardDescription>Manage subscription plans</CardDescription>
          </div>
          <div className="flex space-x-2">
            {plans.length === 0 && (
              <Button onClick={createSamplePlans} variant="outline" size="sm">
                Create Sample Plans
              </Button>
            )}
            <Button onClick={handleAdd} size="sm">
              <Plus size={16} className="mr-2" />
              Add Plan
            </Button>
          </div>
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
            <PlanForm
              formData={formData}
              editingPlan={editingPlan}
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
