
import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Pricing = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Simple, Transparent Pricing</h2>
        <div className="max-w-lg mx-auto bg-white border border-jess-subtle rounded-xl p-8 shadow-sm">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Monthly Plan</h3>
            <div className="flex items-baseline justify-center gap-x-2 mb-6">
              <span className="text-4xl font-bold">$14.99</span>
              <span className="text-jess-muted">/month</span>
            </div>
            <p className="text-jess-muted mb-6">Start with a 7-day free trial</p>
            <ul className="space-y-4 text-left mb-8">
              <PricingFeature text="Unlimited conversations with JESS" />
              <PricingFeature text="Guided journaling experiences" />
              <PricingFeature text="Personalized story exploration" />
              <PricingFeature text="Advanced self-discovery tools" />
            </ul>
            <Link to="/signup">
              <Button size="lg" className="w-full">
                Start 7-Day Free Trial
              </Button>
            </Link>
            <p className="text-sm text-jess-muted mt-4">No credit card required for trial</p>
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
