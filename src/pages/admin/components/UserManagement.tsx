
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { UserTable } from "./user/UserTable";
import { useUserManagement } from "../hooks/useUserManagement";

export const UserManagement = () => {
  const { users, loading, toggleAdminStatus, deleteUser } = useUserManagement();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and roles</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UserTable 
          users={users}
          loading={loading}
          onToggleAdminStatus={toggleAdminStatus}
          onDeleteUser={deleteUser}
        />
      </CardContent>
    </Card>
  );
};
