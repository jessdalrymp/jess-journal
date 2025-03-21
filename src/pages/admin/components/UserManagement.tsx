
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { UserTable } from "./user/UserTable";
import { useUserManagement } from "../hooks/useUserManagement";
import { Button } from "../../../components/ui/button";
import { RefreshCw } from "lucide-react";

export const UserManagement = () => {
  const { users, loading, fetchUsers, toggleAdminStatus, deleteUser } = useUserManagement();

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and roles</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchUsers()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
