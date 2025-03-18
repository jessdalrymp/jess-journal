
import React, { useState } from 'react';
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "../../../../components/ui/dialog";
import { PaymentType } from '../../hooks/usePaymentManagement';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

interface PaymentTableProps {
  payments: PaymentType[];
  loading: boolean;
  onRefund: (paymentId: string, squarePaymentId: string) => Promise<boolean>;
}

export const PaymentTable = ({ payments, loading, onRefund }: PaymentTableProps) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (loading) {
    return <div className="text-center py-4">Loading payments...</div>;
  }
  
  if (payments.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No payments found.</div>;
  }
  
  const handleRefund = async () => {
    if (!selectedPayment || !selectedPayment.square_payment_id) return;
    
    setIsProcessing(true);
    const success = await onRefund(selectedPayment.id, selectedPayment.square_payment_id);
    
    if (success) {
      setIsConfirmDialogOpen(false);
    }
    
    setIsProcessing(false);
  };

  const getStatusBadgeVariant = (status: string, refunded: boolean) => {
    if (refunded) return 'destructive';
    
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map(payment => (
            <TableRow key={payment.id}>
              <TableCell>{payment.user_email}</TableCell>
              <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(payment.status, !!payment.refunded_at)}>
                  {payment.refunded_at ? 'Refunded' : payment.status}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDate(payment.created_at)}
                {payment.refunded_at && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Refunded: {formatDate(payment.refunded_at)}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!payment.square_payment_id || payment.status !== 'completed' || !!payment.refunded_at}
                  onClick={() => {
                    setSelectedPayment(payment);
                    setIsConfirmDialogOpen(true);
                  }}
                >
                  Refund
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Refund</DialogTitle>
            <DialogDescription>
              Are you sure you want to refund this payment?
              {selectedPayment && (
                <div className="mt-2">
                  <p><strong>Amount:</strong> {selectedPayment && formatCurrency(selectedPayment.amount, selectedPayment.currency)}</p>
                  <p><strong>Customer:</strong> {selectedPayment?.user_email}</p>
                  <p><strong>Date:</strong> {selectedPayment && formatDate(selectedPayment.created_at)}</p>
                </div>
              )}
              <p className="mt-2 text-destructive text-sm">This action cannot be undone.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleRefund}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
