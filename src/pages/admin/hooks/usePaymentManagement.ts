
import { useState } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentType {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  square_payment_id: string | null;
  created_at: string;
  updated_at: string | null;
  refunded_at?: string | null;
  user_email?: string;
}

export const usePaymentManagement = () => {
  const [payments, setPayments] = useState<PaymentType[]>([]);
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
      
      // For each payment, get the user email
      if (data) {
        const paymentsWithEmail = await Promise.all(
          data.map(async (payment) => {
            const email = await getUserEmail(payment.user_id);
            return {
              ...payment,
              user_email: email
            };
          })
        );
        setPayments(paymentsWithEmail);
      } else {
        setPayments([]);
      }
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

  const refundPayment = async (paymentId: string, squarePaymentId: string) => {
    setLoading(true);
    try {
      // Call the Supabase Edge Function for refunding
      const response = await fetch('/api/refund-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          squarePaymentId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process refund');
      }

      // Optimistically update the payment status in the UI
      setPayments(
        payments.map((payment) =>
          payment.id === paymentId
            ? {
                ...payment,
                status: 'refunded',
                refunded_at: new Date().toISOString(),
              }
            : payment
        )
      );

      toast({
        title: 'Success',
        description: 'Payment has been refunded successfully',
      });

      return true;
    } catch (error: any) {
      console.error('Error refunding payment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process refund',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    fetchPayments,
    getUserEmail,
    updatePaymentStatus,
    refundPayment
  };
};
