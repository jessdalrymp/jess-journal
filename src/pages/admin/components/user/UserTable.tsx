
import React, { useState } from 'react';
import {
  Table,
  TableBody,
} from "../../../../components/ui/table";
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { UserTableEmptyState } from './UserTableEmptyState';
import { UserTableLoading } from './UserTableLoading';
import { DeleteUserDialog } from './DeleteUserDialog';

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

interface UserTableProps {
  users: UserType[];
  loading: boolean;
  onToggleAdminStatus?: (userId: string, currentStatus: boolean) => Promise<boolean>;
  onDeleteUser?: (userId: string, email: string) => Promise<boolean>;
}

export const UserTable = ({ users, loading, onToggleAdminStatus, onDeleteUser }: UserTableProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{id: string, email: string} | null>(null);
  
  if (loading) {
    return <UserTableLoading />;
  }
  
  if (!users || users.length === 0) {
    return <UserTableEmptyState />;
  }
  
  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (onToggleAdminStatus) {
      await onToggleAdminStatus(userId, currentStatus);
    }
  };

  const handleDeleteClick = (userId: string, email: string) => {
    setUserToDelete({ id: userId, email });
  };

  const confirmDelete = async () => {
    if (userToDelete && onDeleteUser) {
      setIsDeleting(true);
      try {
        await onDeleteUser(userToDelete.id, userToDelete.email);
      } finally {
        setIsDeleting(false);
        setUserToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <UserTableHeader />
        <TableBody>
          {users.map(user => (
            <UserTableRow 
              key={user.id}
              user={user}
              onToggleAdmin={handleToggleAdmin}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </TableBody>
      </Table>

      <DeleteUserDialog 
        userToDelete={userToDelete}
        isDeleting={isDeleting}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
