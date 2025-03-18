
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/table';
import { UserActions } from './UserActions';

interface User {
  id: string;
  email: string;
  created_at: string;
  profile_data: any;
  subscription_data: any;
  is_admin: boolean;
}

interface UserTableProps {
  users: User[];
  toggleAdminStatus: (userId: string, currentStatus: boolean) => Promise<void>;
  applyCouponToUser: (userId: string, couponCode: string) => Promise<void>;
  formatDate: (dateString: string) => string;
  getSubscriptionStatus: (user: User) => string;
  getSubscriptionExpiry: (user: User) => string;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  toggleAdminStatus,
  applyCouponToUser,
  formatDate,
  getSubscriptionStatus,
  getSubscriptionExpiry
}) => {
  return (
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
          {users.map((user) => (
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
                {user.is_admin ? 'Yes' : 'No'}
              </TableCell>
              <TableCell>
                <UserActions 
                  userId={user.id}
                  isAdmin={user.is_admin}
                  onToggleAdmin={toggleAdminStatus}
                  onApplyCoupon={applyCouponToUser}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
