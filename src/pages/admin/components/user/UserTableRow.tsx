
import React from 'react';
import {
  TableCell,
  TableRow,
} from "../../../../components/ui/table";
import { UserRoleBadge } from './UserRoleBadge';
import { UserSubscriptionBadge } from './UserSubscriptionBadge';
import { UserActionButtons } from './UserActionButtons';

interface UserType {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string | null;
  is_admin: boolean;
  subscription?: {
    status: string;
    is_trial: boolean | null;
    is_unlimited: boolean | null;
    trial_ends_at?: string | null;
    current_period_ends_at?: string | null;
  };
}

interface UserTableRowProps {
  user: UserType;
  onToggleAdmin: (userId: string, currentStatus: boolean) => Promise<void>;
  onDeleteClick: (userId: string, email: string) => void;
}

export const UserTableRow = ({ user, onToggleAdmin, onDeleteClick }: UserTableRowProps) => {
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
      </TableCell>
      <TableCell>
        <UserRoleBadge isAdmin={user.is_admin} />
      </TableCell>
      <TableCell>
        <UserSubscriptionBadge subscription={user.subscription} />
      </TableCell>
      <TableCell>
        <UserActionButtons 
          userId={user.id}
          email={user.email}
          isAdmin={user.is_admin}
          onToggleAdmin={onToggleAdmin}
          onDeleteClick={() => onDeleteClick(user.id, user.email)}
        />
      </TableCell>
    </TableRow>
  );
};
