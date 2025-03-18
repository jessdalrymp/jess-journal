
import { useState } from 'react';
import { supabase } from "../../../integrations/supabase/client";
import { useToast } from "../../../hooks/use-toast";

export interface PaymentType {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  is_annual: boolean;
  square_payment_id: string | null;
  created_at: string;
  updated_at: string;
  user_email?: string;
  refunded_at?: string | null;
}

export const usePaymentManagement = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      console.log("Fetching payments...");
      
      // Get payments
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (paymentError) {
        console.error('Payment query failed:', paymentError);
        throw paymentError;
      }

      // Get user emails to match with payments
      const userIds = [...new Set(paymentData.map((payment: any) => payment.user_id))];
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .in('id', userIds);
      
      if (userError) {
        console.error('User query failed:', userError);
        // Continue with what we have
      }
      
      // Create a map of user_id to email
      const userEmailMap = new Map();
      if (userData) {
        userData.forEach((user: any) => {
          userEmailMap.set(user.id, user.email);
        });
      }
      
      // Combine payment data with user emails
      const mappedPayments = paymentData.map((payment: any) => ({
        ...payment,
        user_email: userEmailMap.get(payment.user_id) || 'Unknown',
      }));
      
      console.log("Payments with user data:", mappedPayments);
      setPayments(mappedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error fetching payments",
        description: "Could not retrieve payment data",
        variant: "destructive"
      });
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const refundPayment = async (paymentId: string, squarePaymentId: string) => {
    try {
      setLoading(true);
      
      // Call the Edge Function to process the refund
      const { data, error } = await supabase.functions.invoke("refund-payment", {
        body: { 
          paymentId,
          squarePaymentId
        }
      });
      
      if (error) {
        console.error("Error processing refund:", error);
        toast({
          title: "Refund failed",
          description: error.message || "Could not process refund",
          variant: "destructive"
        });
        return false;
      }
      
      if (data && data.success) {
        toast({
          title: "Refund successful",
          description: "Payment has been refunded",
        });
        
        // Update local state
        fetchPayments();
        return true;
      } else {
        toast({
          title: "Refund failed",
          description: data?.error || "Could not process refund",
          variant: "destructive"
        });
        return false;
      }
    } catch (error: any) {
      console.error("Error in refundPayment:", error);
      toast({
        title: "Refund failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
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
    refundPayment
  };
};
