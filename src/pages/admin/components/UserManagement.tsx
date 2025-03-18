
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { AlertCircle, Search, UserPlus } from "lucide-react";
import { supabase } from "../../../integrations/supabase/client";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { useToast } from "../../../hooks/use-toast";

type User = {
  id: string;
  email: string;
  is_admin: boolean;
};

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const { toast } = useToast();
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use 'any' type to bypass TypeScript checking for the RPC function name
      const { data, error } = await supabase.rpc('get_users_admin_status' as any);
      
      if (error) {
        throw error;
      }
      
      console.log('Users data:', data);
      if (Array.isArray(data)) {
        setUsers(data as User[]);
      } else {
        console.error('Expected array but got:', typeof data);
        setUsers([]);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to load users');
      toast({
        title: "Error loading users",
        description: "There was a problem fetching the user list",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleMakeAdmin = async (userId: string) => {
    try {
      // Use 'any' type to bypass TypeScript checking for the RPC function name
      const { data, error } = await supabase.rpc('make_user_admin_by_id' as any, {
        target_user_id: userId
      });
      
      if (error) throw error;
      
      if (data === true) {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, is_admin: true } : user
          )
        );
        
        toast({
          title: "Success",
          description: "User is now an admin",
        });
      } else {
        toast({
          title: "Not Changed",
          description: "No changes were made",
        });
      }
    } catch (error: any) {
      console.error('Error making user admin:', error);
      toast({
        title: "Error",
        description: error.message || "Couldn't update admin status",
        variant: "destructive"
      });
    }
  };
  
  const handleSearchUser = async () => {
    if (!searchEmail || searchEmail.trim() === '') {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Use 'any' type to bypass TypeScript checking for the RPC function name
      const { data, error } = await supabase.rpc('find_user_by_email' as any, {
        email_query: searchEmail.trim()
      });
      
      if (error) throw error;
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Check if user already exists in our list
        const foundUsers = data as User[];
        const newUsers = foundUsers.filter(
          foundUser => !users.some(user => user.id === foundUser.id)
        );
        
        if (newUsers.length > 0) {
          setUsers(prevUsers => [...prevUsers, ...newUsers]);
        }
        
        setSearchEmail('');
        toast({
          title: "User Found",
          description: `Found ${foundUsers.length} user(s) matching "${searchEmail.trim()}"`,
        });
      } else {
        toast({
          title: "No Results",
          description: "No user found with that email",
        });
      }
    } catch (error: any) {
      console.error('Error searching for user:', error);
      toast({
        title: "Search Failed",
        description: error.message || "Couldn't search for user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = searchTerm.trim() === '' 
    ? users 
    : users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage admin users</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex gap-2 mb-6">
          <div className="flex-1">
            <Label htmlFor="search">Search existing users</Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Filter by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="add-user">Find user by email</Label>
            <div className="flex gap-2">
              <Input
                id="add-user"
                placeholder="Enter email address..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <Button onClick={handleSearchUser} disabled={loading}>
                <UserPlus className="h-4 w-4 mr-2" />
                Find
              </Button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No users found.</div>
        ) : (
          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2 pl-4">Email</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-right p-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="p-2 pl-4">{user.email}</td>
                    <td className="p-2">
                      {user.is_admin ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          User
                        </span>
                      )}
                    </td>
                    <td className="p-2 pr-4 text-right">
                      {!user.is_admin && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMakeAdmin(user.id)}
                        >
                          Make Admin
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
