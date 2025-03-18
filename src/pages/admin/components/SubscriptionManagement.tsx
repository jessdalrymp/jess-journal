
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
import { Calendar, CreditCard, TicketIcon, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { formatCouponDiscount } from "./coupons/utils";

interface SubscriptionData {
  id: string;
  user_id: string;
  user_email: string;
  status: string;
  is_trial: boolean;
  is_unlimited: boolean;
  created_at: string;
  current_period_ends_at: string | null;
  trial_ends_at: string | null;
  coupon_code: string | null;
}

export const SubscriptionManagement = () => {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionData | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      
      // Fetch subscriptions with user email
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include the email
      const formattedData = data?.map(item => ({
        ...item,
        user_email: item.profiles?.email || 'Unknown'
      }));
      
      setSubscriptions(formattedData || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error fetching subscriptions",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;
    
    try {
      // Call the edge function to cancel the subscription
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          subscriptionId: selectedSubscription.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      // Update the local state
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.map(sub => 
          sub.id === selectedSubscription.id 
            ? { ...sub, status: 'cancelled' } 
            : sub
        )
      );
      
      toast({
        title: "Subscription cancelled",
        description: "The subscription has been successfully cancelled"
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error cancelling subscription",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setConfirmDialogOpen(false);
      setSelectedSubscription(null);
    }
  };

  const confirmCancelSubscription = (subscription: SubscriptionData) => {
    setSelectedSubscription(subscription);
    setConfirmDialogOpen(true);
  };

  const getStatusBadge = (status: string, isUnlimited: boolean) => {
    if (isUnlimited) {
      return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Unlimited</span>;
    }
    
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>;
      case 'trial':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Trial</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Subscription Management</CardTitle>
            <CardDescription>Manage user subscriptions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading subscriptions...</div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-4 text-jess-muted">No subscriptions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Coupon</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map(subscription => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.user_email}</TableCell>
                    <TableCell>
                      {getStatusBadge(subscription.status, subscription.is_unlimited)}
                    </TableCell>
                    <TableCell>{formatDate(subscription.created_at)}</TableCell>
                    <TableCell>
                      {subscription.is_unlimited 
                        ? 'Unlimited' 
                        : formatDate(subscription.trial_ends_at || subscription.current_period_ends_at)}
                    </TableCell>
                    <TableCell>
                      {subscription.coupon_code ? (
                        <div className="flex items-center">
                          <TicketIcon className="mr-1 h-4 w-4 text-indigo-600" />
                          <span>{subscription.coupon_code}</span>
                        </div>
                      ) : (
                        'None'
                      )}
                    </TableCell>
                    <TableCell>
                      {subscription.status !== 'cancelled' && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => confirmCancelSubscription(subscription)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this subscription? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedSubscription && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">User:</span>
                    <span className="font-medium">{selectedSubscription.user_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span>{selectedSubscription.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Type:</span>
                    <span>{selectedSubscription.is_unlimited ? 'Unlimited' : 'Standard'}</span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleCancelSubscription}>
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
