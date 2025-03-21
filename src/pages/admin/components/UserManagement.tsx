
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { UserTable } from "./user/UserTable";
import { useUserManagement } from "../hooks/useUserManagement";
import { Button } from "../../../components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";

export const UserManagement = () => {
  const { users, loading, error, fetchUsers, toggleAdminStatus, deleteUser } = useUserManagement();

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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error fetching users</AlertTitle>
            <AlertDescription>
              {error.message || "There was an error loading user data. Please try again."}
            </AlertDescription>
          </Alert>
        )}
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
