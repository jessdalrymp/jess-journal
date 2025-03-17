
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Subscription } from "@/context/types";

interface PricingPlanProps {
  subscription: Subscription | null;
  handleStartTrial: () => Promise<void>;
  handleInitiatePayment: (isAnnual: boolean) => Promise<void>;
  isProcessing: boolean;
}

export const PricingPlan = ({ 
  subscription, 
  handleStartTrial, 
  handleInitiatePayment, 
  isProcessing 
}: PricingPlanProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Monthly Plan */}
      <div className="bg-white border border-jess-subtle rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-medium text-jess-primary mb-4">
          Premium Plan - Monthly
        </h3>
        
        <p className="text-3xl font-bold mb-4">$14.99<span className="text-sm font-normal text-jess-muted">/month</span></p>
        
        <ul className="space-y-2 mb-6">
          <li className="flex items-start">
            <Check size={18} className="mr-2 text-jess-primary mt-0.5 flex-shrink-0" />
            <span>Unlimited conversations with Jess</span>
          </li>
          <li className="flex items-start">
            <Check size={18} className="mr-2 text-jess-primary mt-0.5 flex-shrink-0" />
            <span>Exclusive journal insight reports</span>
          </li>
          <li className="flex items-start">
            <Check size={18} className="mr-2 text-jess-primary mt-0.5 flex-shrink-0" />
            <span>Priority access to new features</span>
          </li>
          <li className="flex items-start">
            <Check size={18} className="mr-2 text-jess-primary mt-0.5 flex-shrink-0" />
            <span>7-day free trial</span>
          </li>
        </ul>
        
        {!subscription ? (
          <Button 
            className="w-full bg-jess-primary hover:bg-jess-primary/90" 
            onClick={handleStartTrial}
            disabled={isProcessing}
          >
            Start 7-Day Free Trial
          </Button>
        ) : subscription.is_trial ? (
          <Button 
            className="w-full bg-jess-primary hover:bg-jess-primary/90" 
            onClick={() => handleInitiatePayment(false)}
            disabled={isProcessing}
          >
            Subscribe Monthly
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
            className="w-full bg-jess-primary hover:bg-jess-primary/90" 
            onClick={() => handleInitiatePayment(false)}
            disabled={isProcessing}
          >
            Renew Subscription
          </Button>
        )}
      </div>
      
      {/* Annual Plan */}
      <div className="bg-white border-2 border-jess-primary rounded-lg p-6 shadow-md relative">
        <div className="absolute -top-3 right-4 bg-jess-primary text-white px-3 py-1 rounded-full text-xs font-medium">
          Best Value
        </div>
        
        <h3 className="text-xl font-medium text-jess-primary mb-4">
          Premium Plan - Annual
        </h3>
        
        <p className="text-3xl font-bold mb-1">$99<span className="text-sm font-normal text-jess-muted">/year</span></p>
        <p className="text-sm text-jess-primary mb-4">That's just $8.25/month - Save over $80 a year!</p>
        
        <ul className="space-y-2 mb-6">
          <li className="flex items-start">
            <Check size={18} className="mr-2 text-jess-primary mt-0.5 flex-shrink-0" />
            <span>Unlimited conversations with Jess</span>
          </li>
          <li className="flex items-start">
            <Check size={18} className="mr-2 text-jess-primary mt-0.5 flex-shrink-0" />
            <span>Exclusive journal insight reports</span>
          </li>
          <li className="flex items-start">
            <Check size={18} className="mr-2 text-jess-primary mt-0.5 flex-shrink-0" />
            <span>Priority access to new features</span>
          </li>
          <li className="flex items-start">
            <Check size={18} className="mr-2 text-jess-primary mt-0.5 flex-shrink-0" />
            <span>Priority support access</span>
          </li>
        </ul>
        
        {!subscription ? (
          <Button 
            className="w-full bg-jess-primary hover:bg-jess-primary/90" 
            onClick={() => handleInitiatePayment(true)}
            disabled={isProcessing}
          >
            Subscribe Annually
          </Button>
        ) : subscription.is_trial ? (
          <Button 
            className="w-full bg-jess-primary hover:bg-jess-primary/90" 
            onClick={() => handleInitiatePayment(true)}
            disabled={isProcessing}
          >
            Subscribe Annually
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
            className="w-full bg-jess-primary hover:bg-jess-primary/90" 
            onClick={() => handleInitiatePayment(true)}
            disabled={isProcessing}
          >
            Renew Subscription
          </Button>
        )}
      </div>
    </div>
  );
};
