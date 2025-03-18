
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { AlertCircle } from "lucide-react";
import { useAdminUsers } from "../../../hooks/useAdminUsers";
import { UserTable } from "./UserTable";

export const UserManagement = () => {
  const { users, loading, toggleAdminRole } = useAdminUsers();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-4 text-jess-muted">No users found.</div>
        ) : (
          <UserTable 
            users={users} 
            onToggleAdminRole={toggleAdminRole} 
          />
        )}
      </CardContent>
    </Card>
  );
};
