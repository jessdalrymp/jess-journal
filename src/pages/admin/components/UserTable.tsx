
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Shield, User } from "lucide-react";
import { UserData } from "../../../hooks/useAdminUsers";

interface UserTableProps {
  users: UserData[];
  onToggleAdminRole: (userId: string, isCurrentlyAdmin: boolean) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onToggleAdminRole }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </TableCell>
              <TableCell>
                {user.is_admin ? (
                  <div className="flex items-center">
                    <Shield className="mr-1 h-4 w-4 text-indigo-600" />
                    <span>Admin</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4 text-gray-600" />
                    <span>User</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Button 
                  variant={user.is_admin ? "outline" : "default"} 
                  size="sm"
                  onClick={() => onToggleAdminRole(user.id, user.is_admin)}
                >
                  {user.is_admin ? "Remove Admin" : "Make Admin"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
