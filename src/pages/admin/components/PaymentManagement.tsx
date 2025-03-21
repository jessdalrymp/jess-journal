
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../../../integrations/supabase/client";
import { useToast } from "../../../hooks/use-toast";
import { PaymentTable } from "./payment/PaymentTable";
import { usePaymentManagement } from "../hooks/usePaymentManagement";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const PaymentManagement = () => {
  const { toast } = useToast();
  const { payments, loading, fetchPayments, refundPayment } = usePaymentManagement();

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>
                View and manage customer payments and issue refunds
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchPayments()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
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
