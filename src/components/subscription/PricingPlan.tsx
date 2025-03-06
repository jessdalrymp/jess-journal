
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Subscription } from "@/context/types";

interface PricingPlanProps {
  subscription: Subscription | null;
  handleStartTrial: () => Promise<void>;
  handleInitiatePayment: () => Promise<void>;
  isProcessing: boolean;
}

export const PricingPlan = ({ 
  subscription, 
  handleStartTrial, 
  handleInitiatePayment, 
  isProcessing 
}: PricingPlanProps) => {
  return (
    <div className="bg-white border border-jess-subtle rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-medium text-jess-primary mb-4">Premium Plan</h3>
      <p className="text-3xl font-bold mb-4">$14.99<span className="text-sm font-normal text-jess-muted">/month</span></p>
      
      <ul className="space-y-2 mb-4">
        <li className="flex items-start">
          <Check size={18} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Unlimited conversations with Jess</span>
        </li>
        <li className="flex items-start">
          <Check size={18} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Exclusive journal insight reports</span>
        </li>
        <li className="flex items-start">
          <Check size={18} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Priority access to new features</span>
        </li>
        <li className="flex items-start">
          <Check size={18} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
          <span>7-day free trial</span>
        </li>
      </ul>
      
      {!subscription ? (
        <Button 
          className="w-full" 
          onClick={handleStartTrial}
          disabled={isProcessing}
        >
          Start 7-Day Free Trial
        </Button>
      ) : subscription.is_trial ? (
        <Button 
          className="w-full" 
          onClick={handleInitiatePayment}
          disabled={isProcessing}
        >
          Subscribe Now
        </Button>
      ) : subscription.status === "active" ? (
        <Button 
          className="w-full" 
          variant="outline"
          disabled
        >
          Already Subscribed
        </Button>
      ) : (
        <Button 
          className="w-full" 
          onClick={handleInitiatePayment}
          disabled={isProcessing}
        >
          Renew Subscription
        </Button>
      )}
    </div>
  );
};
