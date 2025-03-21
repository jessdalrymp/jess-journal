
import React from 'react';
import { Badge } from "../../../../components/ui/badge";

interface UserRoleBadgeProps {
  isAdmin: boolean;
}

export const UserRoleBadge = ({ isAdmin }: UserRoleBadgeProps) => {
  return (
    <Badge variant={isAdmin ? "default" : "outline"}>
      {isAdmin ? 'Admin' : 'User'}
    </Badge>
  );
};
