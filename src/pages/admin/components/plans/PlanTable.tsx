
import React from 'react';
import { Button } from "../../../../components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { PlanType } from './types';

interface PlanTableProps {
  plans: PlanType[];
  onEdit: (plan: PlanType) => void;
  onDelete: (id: string) => void;
}

export const PlanTable: React.FC<PlanTableProps> = ({ plans, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
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
              <TableCell>{plan.name}</TableCell>
              <TableCell>{plan.description || '-'}</TableCell>
              <TableCell>${(plan.price / 100).toFixed(2)}</TableCell>
              <TableCell>{plan.interval}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs rounded-full ${plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {plan.is_active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(plan)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(plan.id)}>
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
