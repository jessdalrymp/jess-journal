
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { SubscriptionStatus } from "../../../components/subscription/SubscriptionStatus";
import { Subscription } from "../../../context/types";
import { useSubscriptionActions } from "../hooks/useSubscriptionActions";

interface SubscriptionStatusCardProps {
  subscription: Subscription | null;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SubscriptionStatusCard = ({ 
  subscription,
  isProcessing,
  setIsProcessing
}: SubscriptionStatusCardProps) => {
  const { handleInitiatePayment } = useSubscriptionActions(setIsProcessing);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>View your current subscription details</CardDescription>
      </CardHeader>
      <CardContent>
        <SubscriptionStatus 
          subscription={subscription} 
          handleInitiatePayment={handleInitiatePayment}
          isProcessing={isProcessing}
        />
      </CardContent>
    </Card>
  );
};
