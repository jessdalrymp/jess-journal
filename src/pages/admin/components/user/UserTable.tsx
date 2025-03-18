
import React from 'react';
import { Badge } from "../../../../components/ui/badge";

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
}

export const UserTable = ({ users, loading }: UserTableProps) => {
  if (loading) {
    return <div className="text-center py-4">Loading users...</div>;
  }
  
  if (users.length === 0) {
    return <div className="text-center py-4 text-jess-muted">No users found.</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-jess-subtle">
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Joined</th>
            <th className="px-4 py-2 text-left">Last Login</th>
            <th className="px-4 py-2 text-left">Role</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
