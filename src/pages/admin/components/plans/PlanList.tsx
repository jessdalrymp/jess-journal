
import React from 'react';
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { PlanType } from './usePlanManagement';

interface PlanListProps {
  plans: PlanType[];
  onEdit: (plan: PlanType) => void;
  onDelete: (id: string) => void;
}

export const PlanList: React.FC<PlanListProps> = ({ plans, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-jess-subtle">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Interval</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan.id} className="border-b border-jess-subtle">
              <td className="px-4 py-3">{plan.name}</td>
              <td className="px-4 py-3">{plan.description || '-'}</td>
              <td className="px-4 py-3">${(plan.price / 100).toFixed(2)}</td>
              <td className="px-4 py-3">{plan.interval}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {plan.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(plan)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(plan.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
