
import React from 'react';
import { Badge } from "../../../../components/ui/badge";
import { Switch } from "../../../../components/ui/switch";

interface UserType {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string | null;
  is_admin: boolean;
}

interface UserTableProps {
  users: UserType[];
  loading: boolean;
  onToggleAdminStatus?: (userId: string, currentStatus: boolean) => Promise<boolean>;
}

export const UserTable = ({ users, loading, onToggleAdminStatus }: UserTableProps) => {
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
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-jess-subtle">
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Joined</th>
            <th className="px-4 py-2 text-left">Last Login</th>
            <th className="px-4 py-2 text-left">Role</th>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
