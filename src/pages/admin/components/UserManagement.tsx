
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import { useToast } from '../../../hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Switch } from '../../../components/ui/switch';
import { Search, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
  profile_data: any;
  subscription_data: any;
  is_admin: boolean;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'email' | 'id'>('email');
  const [currentTab, setCurrentTab] = useState('all');
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_users_with_details');
      
      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      setUsers(data as User[]);
      applyFilters(data as User[], searchTerm, currentTab);
    } catch (error) {
      console.error('Error in user management:', error);
      toast({
        title: "An unexpected error occurred",
        description: "Could not fetch user data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const applyFilters = (userList: User[], term: string, tab: string) => {
    let filtered = [...userList];
    
    // Apply search filter
    if (term) {
      filtered = filtered.filter(user => 
        searchField === 'email' ? 
        user.email.toLowerCase().includes(term.toLowerCase()) : 
        user.id.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (tab === 'admin') {
      filtered = filtered.filter(user => user.is_admin);
    } else if (tab === 'subscribed') {
      filtered = filtered.filter(user => 
        user.subscription_data && 
        (user.subscription_data.status === 'active' || user.subscription_data.is_unlimited)
      );
    } else if (tab === 'trial') {
      filtered = filtered.filter(user => 
        user.subscription_data && user.subscription_data.is_trial
      );
    }
    
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    applyFilters(users, searchTerm, currentTab);
  }, [searchTerm, searchField, currentTab, users]);

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { data, error } = await supabase.rpc(
        'toggle_user_admin_status',
        { p_user_id: userId, p_admin_status: !currentStatus }
      );
      
      if (error) {
        console.error('Error updating admin status:', error);
        toast({
          title: "Error updating admin status",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        // Update the local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, is_admin: !currentStatus } : user
        ));
        
        toast({
          title: "Admin status updated",
          description: `User is now ${!currentStatus ? 'an admin' : 'not an admin'}`,
        });
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast({
        title: "An unexpected error occurred",
        description: "Could not update admin status",
        variant: "destructive"
      });
    }
  };

  const applyCouponToUser = async (userId: string, couponCode: string) => {
    if (!couponCode.trim()) {
      toast({
        title: "Missing coupon code",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase.rpc(
        'apply_coupon_to_user',
        { p_user_id: userId, p_coupon_code: couponCode.trim() }
      );
      
      if (error) {
        console.error('Error applying coupon:', error);
        toast({
          title: "Error applying coupon",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        // Refresh user data
        loadUsers();
        
        toast({
          title: "Coupon applied successfully",
          description: `Coupon ${couponCode} has been applied to the user`,
        });
      } else {
        toast({
          title: "Coupon application failed",
          description: "The coupon could not be applied",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "An unexpected error occurred",
        description: "Could not apply coupon",
        variant: "destructive"
      });
    }
  };

  const handleCouponSubmit = (event: React.FormEvent<HTMLFormElement>, userId: string) => {
    event.preventDefault();
    const form = event.currentTarget;
    const couponInput = form.elements.namedItem('coupon') as HTMLInputElement;
    
    if (couponInput && couponInput.value) {
      applyCouponToUser(userId, couponInput.value);
      couponInput.value = ''; // Clear the input after submission
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubscriptionStatus = (user: User) => {
    if (!user.subscription_data) return 'None';
    
    if (user.subscription_data.is_unlimited) return 'Unlimited';
    if (user.subscription_data.is_trial) return 'Trial';
    if (user.subscription_data.status === 'active') return 'Active';
    
    return user.subscription_data.status || 'None';
  };

  const getSubscriptionExpiry = (user: User) => {
    if (!user.subscription_data) return 'N/A';
    
    if (user.subscription_data.is_unlimited) return 'Never';
    if (user.subscription_data.is_trial && user.subscription_data.trial_ends_at) {
      return formatDate(user.subscription_data.trial_ends_at);
    }
    if (user.subscription_data.current_period_ends_at) {
      return formatDate(user.subscription_data.current_period_ends_at);
    }
    
    return 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">User Management</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={loadUsers}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={`Search by ${searchField}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={searchField === 'email' ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchField('email')}
          >
            Email
          </Button>
          <Button
            variant={searchField === 'id' ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchField('id')}
          >
            ID
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="subscribed">Subscribed</TabsTrigger>
          <TabsTrigger value="trial">Trial</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10">No users found</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Coupon</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>{getSubscriptionStatus(user)}</TableCell>
                  <TableCell>{getSubscriptionExpiry(user)}</TableCell>
                  <TableCell>
                    {user.subscription_data && user.subscription_data.coupon_code ? 
                      user.subscription_data.coupon_code : 
                      'None'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Switch 
                        checked={user.is_admin} 
                        onCheckedChange={() => toggleAdminStatus(user.id, user.is_admin)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <form 
                      onSubmit={(e) => handleCouponSubmit(e, user.id)} 
                      className="flex gap-2"
                    >
                      <Input 
                        type="text" 
                        name="coupon" 
                        placeholder="Coupon code" 
                        className="w-28"
                      />
                      <Button type="submit" size="sm">Apply</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
