import { useState } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePaymentManagement = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*, payment_plans(name, price)');
      
      if (error) {
        throw error;
      }
      
      setPayments(data || []);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserEmail = async (userId: string) => {
    try {
      // Fetch from profiles table instead of users
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data?.email || 'Unknown';
    } catch (error) {
      console.error('Error fetching user email:', error);
      return 'Unknown';
    }
  };

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: newStatus })
        .eq('id', paymentId);

      if (error) {
        throw error;
      }

      // Optimistically update the payments state
      setPayments(payments.map(payment =>
        payment.id === paymentId ? { ...payment, status: newStatus } : payment
      ));

      toast({
        title: 'Success',
        description: `Payment status updated to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    fetchPayments,
    getUserEmail,
    updatePaymentStatus
  };
};
