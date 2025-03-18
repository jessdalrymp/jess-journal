
import React from 'react';
import { Button } from '../../../components/ui/button';
import { RefreshCw } from 'lucide-react';
import { UserFilters } from './UserFilters';
import { UserTable } from './UserTable';
import { useUserManagement } from '../hooks/useUserManagement';

export const UserManagement = () => {
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    currentTab,
    setCurrentTab,
    loadUsers,
    toggleAdminStatus,
    applyCouponToUser,
    formatDate,
    getSubscriptionStatus,
    getSubscriptionExpiry
  } = useUserManagement();

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

      <UserFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchField={searchField}
        setSearchField={setSearchField}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {loading ? (
        <div className="text-center py-10">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-10">No users found</div>
      ) : (
        <UserTable 
          users={users}
          toggleAdminStatus={toggleAdminStatus}
          applyCouponToUser={applyCouponToUser}
          formatDate={formatDate}
          getSubscriptionStatus={getSubscriptionStatus}
          getSubscriptionExpiry={getSubscriptionExpiry}
        />
      )}
    </div>
  );
};
