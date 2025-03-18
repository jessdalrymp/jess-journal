
import React, { useState, useEffect } from 'react';
import { supabase } from "../../../integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useToast } from "../../../hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../../components/ui/table";
import { Shield, User, AlertCircle } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
}

export const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all users from profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, created_at');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      if (!profilesData || profilesData.length === 0) {
        console.log('No profiles found');
        setUsers([]);
        return;
      }

      console.log(`Found ${profilesData.length} profiles`);

      // Instead of checking the user_roles table directly which has RLS issues,
      // use the check_is_admin RPC function for each user
      const adminStatuses = new Map<string, boolean>();
      
      // First get the current user's admin status as we know that works
      const { data: isCurrentUserAdmin } = await supabase.rpc('check_is_admin');
      
      if (isCurrentUserAdmin) {
        // If we're an admin, we can safely use this information
        const usersWithRoles = profilesData.map(profile => {
          return {
            id: profile.id,
            email: profile.email || 'Unknown',
            created_at: profile.created_at,
            is_admin: false // We'll update admin statuses in a separate step if needed
          };
        });
        
        setUsers(usersWithRoles);
        
        // Try to get admin info if possible
        try {
          // Try a direct query if the user is an admin
          const { data: adminRolesData, error: adminRolesError } = await supabase
            .from('user_roles')
            .select('user_id')
            .eq('role', 'admin');
            
          if (!adminRolesError && adminRolesData) {
            // Create a set of admin user IDs for quick lookup
            const adminUserIds = new Set(adminRolesData.map(role => role.user_id));
            
            // Update the users array with admin status
            setUsers(prevUsers => 
              prevUsers.map(user => ({
                ...user,
                is_admin: adminUserIds.has(user.id)
              }))
            );
          }
        } catch (adminError) {
          console.error('Error fetching admin roles:', adminError);
          // Continue without admin info, we'll still show the users
        }
      } else {
        // Fallback approach - just mark the current user as admin if we got to this page
        // Fix: Get the current user data using await
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        const currentUserId = currentUser?.id;
        
        const usersWithRoles = profilesData.map(profile => {
          // Current user is admin if they got to this page
          const isAdmin = profile.id === currentUserId;
          
          return {
            id: profile.id,
            email: profile.email || 'Unknown',
            created_at: profile.created_at,
            is_admin: isAdmin
          };
        });
        
        setUsers(usersWithRoles);
      }
      
      console.log(`Processed ${users.length} users with roles`);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: "Please check console for details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminRole = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
          
        if (error) throw error;
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'admin'
          });
          
        if (error) throw error;
      }
      
      // Refresh users list
      fetchUsers();
      
      toast({
        title: "Success",
        description: `Admin role ${isCurrentlyAdmin ? 'removed from' : 'granted to'} user`,
      });
    } catch (error) {
      console.error('Error toggling admin role:', error);
      toast({
        title: "Error updating user role",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

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
                        onClick={() => toggleAdminRole(user.id, user.is_admin)}
                      >
                        {user.is_admin ? "Remove Admin" : "Make Admin"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
