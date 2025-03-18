
import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PlanType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  is_active: boolean | null;
}

interface PlanTableProps {
  plans: PlanType[];
  handleEdit: (plan: PlanType) => void;
  handleDelete: (id: string) => void;
  loading: boolean;
  isAdmin: boolean | null;
  connectionError?: boolean;
}

export const PlanTable: React.FC<PlanTableProps> = ({ 
  plans, 
  handleEdit, 
  handleDelete,
  loading,
  isAdmin,
  connectionError = false
}) => {
  if (connectionError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription>
          Unable to connect to the payment plans table. This could be due to permission issues.
          {isAdmin === false && (
            <p className="mt-2 font-semibold">
              You need admin privileges to manage payment plans.
            </p>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (loading) {
    return <div className="text-center py-4">Loading plans...</div>;
  }
  
  if (plans.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground mb-2">No plans found.</p>
        {isAdmin ? (
          <p>Create your first plan using the "Add Plan" button above.</p>
        ) : (
          <p>Plans will appear here once they've been created by an administrator.</p>
        )}
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map(plan => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>{plan.description || '-'}</TableCell>
              <TableCell>${plan.price / 100}</TableCell>
              <TableCell className="capitalize">{plan.interval}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs rounded-full ${plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {plan.is_active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEdit(plan)}
                    disabled={isAdmin === false}
                    title={isAdmin === false ? "Admin permission required" : "Edit plan"}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(plan.id)}
                    disabled={isAdmin === false}
                    title={isAdmin === false ? "Admin permission required" : "Delete plan"}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
