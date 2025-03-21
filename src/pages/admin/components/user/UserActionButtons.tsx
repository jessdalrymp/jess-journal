
import React from 'react';
import { Switch } from "../../../../components/ui/switch";
import { Button } from "../../../../components/ui/button";
import { Trash2 } from "lucide-react";

interface UserActionButtonsProps {
  userId: string;
  email: string;
  isAdmin: boolean;
  onToggleAdmin: (userId: string, currentStatus: boolean) => Promise<void>;
  onDeleteClick: (userId: string, email: string) => void;
}

export const UserActionButtons = ({ 
  userId, 
  email,
  isAdmin, 
  onToggleAdmin, 
  onDeleteClick 
}: UserActionButtonsProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Switch 
          checked={isAdmin}
          onCheckedChange={() => onToggleAdmin(userId, isAdmin)}
          id={`admin-toggle-${userId}`}
        />
        <label htmlFor={`admin-toggle-${userId}`} className="text-sm cursor-pointer">
          {isAdmin ? 'Admin' : 'Make Admin'}
        </label>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm"
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => onDeleteClick(userId, email)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
