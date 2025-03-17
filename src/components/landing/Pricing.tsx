
import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Pricing = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center text-jess-muted mb-8 max-w-lg mx-auto">Choose the plan that works best for you</p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-white border border-jess-subtle rounded-xl p-8 shadow-sm">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Monthly Plan</h3>
              <div className="flex items-baseline justify-center gap-x-2 mb-4">
                <span className="text-4xl font-bold">$14.99</span>
                <span className="text-jess-muted">/month</span>
              </div>
              
              <p className="text-jess-muted mb-6">
                Start with a 7-day free trial
              </p>
              
              <ul className="space-y-4 text-left mb-8">
                <PricingFeature text="Unlimited conversations with JESS" />
                <PricingFeature text="Guided journaling experiences" />
                <PricingFeature text="Personalized story exploration" />
                <PricingFeature text="Advanced self-discovery tools" />
              </ul>
              
              <Link to="/dashboard">
                <Button size="lg" className="w-full">
                  Start 7-Day Free Trial
                </Button>
              </Link>
              
              <p className="text-sm text-jess-muted mt-4">
                No credit card required for trial
              </p>
            </div>
          </div>
          
          {/* Annual Plan */}
          <div className="bg-white border-2 border-jess-primary rounded-xl p-8 shadow-md relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-jess-primary text-white px-4 py-1 rounded-full text-sm font-medium">
              Best Value
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Annual Plan</h3>
              <div className="flex items-baseline justify-center gap-x-2 mb-2">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-jess-muted">/year</span>
              </div>
              
              <p className="text-sm text-jess-primary mb-4">
                That's just $8.25/month - Save over $80 a year!
              </p>
              
              <p className="text-jess-muted mb-6">
                Best value, including all features
              </p>
              
              <ul className="space-y-4 text-left mb-8">
                <PricingFeature text="Unlimited conversations with JESS" />
                <PricingFeature text="Guided journaling experiences" />
                <PricingFeature text="Personalized story exploration" />
                <PricingFeature text="Advanced self-discovery tools" />
                <PricingFeature text="Priority support access" />
              </ul>
              
              <Link to="/dashboard">
                <Button size="lg" variant="default" className="w-full bg-jess-primary hover:bg-jess-primary/90">
                  Get Annual Plan
                </Button>
              </Link>
              
              <p className="text-sm text-jess-muted mt-4">
                One-time annual payment, full access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PricingFeature = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3">
    <Check className="h-5 w-5 text-jess-primary flex-shrink-0 mt-0.5" />
    <span>{text}</span>
  </li>
);
