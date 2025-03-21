
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { UserTable } from "./user/UserTable";
import { useUserManagement } from "../hooks/useUserManagement";
import { Button } from "../../../components/ui/button";
import { RefreshCw, ShieldAlert } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../../../components/ui/alert";

export const UserManagement = () => {
  const { users, loading, error, permissionError, fetchUsers, toggleAdminStatus, deleteUser } = useUserManagement();

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
        {permissionError && (
          <Alert variant="destructive" className="mb-4">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Permission Error</AlertTitle>
            <AlertDescription>
              <p>You don't have sufficient permissions to view user data.</p>
              <p className="mt-2 text-sm">
                This typically happens when your Supabase account doesn't have access to view the necessary tables 
                or when Row Level Security (RLS) policies are restricting access.
              </p>
              <p className="mt-2 text-sm">
                Contact your Supabase project owner or make sure your account has admin privileges.
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        {error && !permissionError && (
          <Alert variant="destructive" className="mb-4">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Error Loading Users</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
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
