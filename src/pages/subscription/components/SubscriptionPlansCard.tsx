
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { PricingPlan } from "../../../components/subscription/PricingPlan";
import { Subscription } from "../../../context/types";
import { useSubscriptionActions } from "../hooks/useSubscriptionActions";

interface SubscriptionPlansCardProps {
  subscription: Subscription | null;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SubscriptionPlansCard = ({ 
  subscription,
  isProcessing,
  setIsProcessing
}: SubscriptionPlansCardProps) => {
  const { handleStartTrial, handleInitiatePayment } = useSubscriptionActions(setIsProcessing);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plans</CardTitle>
        <CardDescription>Choose the plan that works for you</CardDescription>
      </CardHeader>
      <CardContent>
        <PricingPlan 
          subscription={subscription}
          handleStartTrial={handleStartTrial}
          handleInitiatePayment={handleInitiatePayment}
          isProcessing={isProcessing}
        />
      </CardContent>
    </Card>
  );
};
