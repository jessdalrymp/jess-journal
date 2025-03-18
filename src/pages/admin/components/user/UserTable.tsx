
import React, { useState } from 'react';
import { Badge } from "../../../../components/ui/badge";
import { Switch } from "../../../../components/ui/switch";
import { Button } from "../../../../components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";

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
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  
  if (loading) {
    return <div className="text-center py-4">Loading users...</div>;
  }
  
  if (users.length === 0) {
    return <div className="text-center py-4 text-jess-muted">No users found.</div>;
  }
  
  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (onToggleAdminStatus) {
      await onToggleAdminStatus(userId, currentStatus);
    }
  };

  const handleDeleteClick = (user: UserType) => {
    setUserToDelete(user);
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

  const getSubscriptionBadgeVariant = (status?: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trial':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const formatSubscriptionStatus = (user: UserType) => {
    if (!user.subscription) return 'None';
    
    if (user.subscription.is_unlimited) {
      return 'Unlimited';
    }
    
    if (user.subscription.is_trial) {
      return 'Trial';
    }
    
    return user.subscription.status.charAt(0).toUpperCase() + user.subscription.status.slice(1);
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-jess-subtle">
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Joined</th>
            <th className="px-4 py-2 text-left">Last Login</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Subscription</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b border-jess-subtle">
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
              </td>
              <td className="px-4 py-3">
                <Badge variant={user.is_admin ? "default" : "outline"}>
                  {user.is_admin ? 'Admin' : 'User'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={getSubscriptionBadgeVariant(user.subscription?.status)}>
                  {formatSubscriptionStatus(user)}
                </Badge>
                {user.subscription?.current_period_ends_at && (
                  <div className="text-xs text-jess-muted mt-1">
                    Ends: {new Date(user.subscription.current_period_ends_at).toLocaleDateString()}
                  </div>
                )}
                {user.subscription?.trial_ends_at && user.subscription.is_trial && (
                  <div className="text-xs text-jess-muted mt-1">
                    Trial ends: {new Date(user.subscription.trial_ends_at).toLocaleDateString()}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={user.is_admin}
                      onCheckedChange={() => handleToggleAdmin(user.id, user.is_admin)}
                      id={`admin-toggle-${user.id}`}
                    />
                    <label htmlFor={`admin-toggle-${user.id}`} className="text-sm cursor-pointer">
                      {user.is_admin ? 'Admin' : 'Make Admin'}
                    </label>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the account for {userToDelete?.email}. 
              This action cannot be undone, and all user data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
