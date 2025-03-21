
import { useState } from 'react';
import { useUserFetching } from './user/useUserFetching';
import { useUserAdminStatus } from './user/useUserAdminStatus';
import { useUserDeletion } from './user/useUserDeletion';

export interface UserType {
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

export const useUserManagement = () => {
  const { users, loading, error, permissionError, fetchUsers } = useUserFetching();
  const { toggleAdminStatus } = useUserAdminStatus(fetchUsers);
  const { deleteUser } = useUserDeletion(fetchUsers);

  return {
    users,
    loading,
    error,
    permissionError,
    fetchUsers,
    toggleAdminStatus,
    deleteUser
  };
};
