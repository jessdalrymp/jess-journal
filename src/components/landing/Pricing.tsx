
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center text-jess-muted mb-8 max-w-lg mx-auto">Choose the plan that works best for you</p>
        
        <div className="max-w-md mx-auto mb-8">
          <RadioGroup 
            className="flex justify-center gap-4 p-1 border rounded-lg"
            value={billingCycle} 
            onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="cursor-pointer">Monthly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yearly" id="yearly" />
              <Label htmlFor="yearly" className="cursor-pointer">
                Yearly <span className="text-xs text-green-600 font-medium">(Save 45%)</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="max-w-lg mx-auto bg-white border border-jess-subtle rounded-xl p-8 shadow-sm">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">
              {billingCycle === 'monthly' ? 'Monthly Plan' : 'Annual Plan'}
            </h3>
            <div className="flex items-baseline justify-center gap-x-2 mb-2">
              {billingCycle === 'monthly' ? (
                <>
                  <span className="text-4xl font-bold">$14.99</span>
                  <span className="text-jess-muted">/month</span>
                </>
              ) : (
                <>
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-jess-muted">/year</span>
                </>
              )}
            </div>
            
            {billingCycle === 'yearly' && (
              <p className="text-sm text-green-600 mb-4">
                That's just $8.25/month - Save over $80 a year!
              </p>
            )}
            
            <p className="text-jess-muted mb-6">
              {billingCycle === 'monthly' ? 'Start with a 7-day free trial' : 'Best value, including all features'}
            </p>
            
            <ul className="space-y-4 text-left mb-8">
              <PricingFeature text="Unlimited conversations with JESS" />
              <PricingFeature text="Guided journaling experiences" />
              <PricingFeature text="Personalized story exploration" />
              <PricingFeature text="Advanced self-discovery tools" />
              {billingCycle === 'yearly' && (
                <PricingFeature text="Priority support access" />
              )}
            </ul>
            
            <Link to="/dashboard">
              <Button size="lg" className="w-full">
                {billingCycle === 'monthly' 
                  ? 'Start 7-Day Free Trial' 
                  : 'Get Annual Plan'}
              </Button>
            </Link>
            
            <p className="text-sm text-jess-muted mt-4">
              {billingCycle === 'monthly' 
                ? 'No credit card required for trial' 
                : 'One-time annual payment, full access'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const PricingFeature = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3">
    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
    <span>{text}</span>
  </li>
);
