
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Subscription } from "@/context/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="bg-white border border-jess-subtle rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <RadioGroup 
          className="flex justify-start gap-4 p-1"
          value={billingCycle} 
          onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly-sub" />
            <Label htmlFor="monthly-sub" className="cursor-pointer">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yearly" id="yearly-sub" />
            <Label htmlFor="yearly-sub" className="cursor-pointer">
              Yearly <span className="text-xs text-green-600 font-medium">(Save 45%)</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <h3 className="text-xl font-medium text-jess-primary mb-4">
        Premium Plan - {billingCycle === 'monthly' ? 'Monthly' : 'Annual'}
      </h3>
      
      {billingCycle === 'monthly' ? (
        <p className="text-3xl font-bold mb-1">$14.99<span className="text-sm font-normal text-jess-muted">/month</span></p>
      ) : (
        <>
          <p className="text-3xl font-bold mb-1">$99<span className="text-sm font-normal text-jess-muted">/year</span></p>
          <p className="text-sm text-green-600 mb-3">That's just $8.25/month - Save over $80 a year!</p>
        </>
      )}
      
      <ul className="space-y-2 mb-6">
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
        {billingCycle === 'monthly' && (
          <li className="flex items-start">
            <Check size={18} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
            <span>7-day free trial</span>
          </li>
        )}
        {billingCycle === 'yearly' && (
          <li className="flex items-start">
            <Check size={18} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Priority support access</span>
          </li>
        )}
      </ul>
      
      {!subscription ? (
        <Button 
          className="w-full" 
          onClick={billingCycle === 'monthly' ? handleStartTrial : handleInitiatePayment}
          disabled={isProcessing}
        >
          {billingCycle === 'monthly' ? 'Start 7-Day Free Trial' : 'Subscribe Annually'}
        </Button>
      ) : subscription.is_trial ? (
        <Button 
          className="w-full" 
          onClick={handleInitiatePayment}
          disabled={isProcessing}
        >
          Subscribe {billingCycle === 'yearly' ? 'Annually' : 'Now'}
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
