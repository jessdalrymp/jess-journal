
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../../../integrations/supabase/client";
import { useToast } from "../../../hooks/use-toast";
import { PaymentTable } from "./payment/PaymentTable";
import { usePaymentManagement } from "../hooks/usePaymentManagement";

export const PaymentManagement = () => {
  const { toast } = useToast();
  const { payments, loading, fetchPayments, refundPayment } = usePaymentManagement();

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>
            View and manage customer payments and issue refunds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentTable 
            payments={payments}
            loading={loading}
            onRefund={refundPayment}
          />
        </CardContent>
      </Card>
    </div>
  );
};
