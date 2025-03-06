
import { ShieldCheck, Clock, AlertCircle, CreditCard } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Subscription } from "@/context/types";

interface SubscriptionStatusProps {
  subscription: Subscription | null;
  handleInitiatePayment: () => Promise<void>;
  isProcessing: boolean;
}

export const SubscriptionStatus = ({ 
  subscription, 
  handleInitiatePayment,
  isProcessing 
}: SubscriptionStatusProps) => {
  if (!subscription) {
    return (
      <div className="text-center p-4 bg-jess-subtle rounded-lg">
        <p>You don't have an active subscription</p>
      </div>
    );
  }

  if (subscription.status === "active" && subscription.is_unlimited) {
    return (
      <div className="bg-jess-subtle p-4 rounded-lg">
        <h3 className="font-medium text-jess-primary mb-2 flex items-center">
          <ShieldCheck size={18} className="mr-2" />
          Unlimited Access
        </h3>
        <p className="text-jess-muted">You have unlimited access to all features!</p>
      </div>
    );
  }

  if (subscription.status === "active" && subscription.is_trial) {
    const trialEndDate = new Date(subscription.trial_ends_at);
    const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    
    return (
      <div className="bg-jess-subtle p-4 rounded-lg">
        <h3 className="font-medium text-jess-primary mb-2 flex items-center">
          <Clock size={18} className="mr-2" />
          Trial Active
        </h3>
        <p className="text-jess-muted">Your trial ends in {daysLeft} days on {trialEndDate.toLocaleDateString()}</p>
        {daysLeft <= 2 && (
          <div className="mt-3 p-3 bg-jess-accent/10 rounded-md border border-jess-accent">
            <p className="text-sm text-jess-accent font-medium flex items-start">
              <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
              Your trial is ending soon! Subscribe now to continue using premium features.
            </p>
            <Button 
              onClick={handleInitiatePayment} 
              className="mt-2 w-full"
              disabled={isProcessing}
            >
              Subscribe Now
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-jess-subtle p-4 rounded-lg">
      <h3 className="font-medium text-jess-primary mb-2 flex items-center">
        <CreditCard size={18} className="mr-2" />
        Subscription: {subscription.status}
      </h3>
      {subscription.current_period_ends_at && (
        <p className="text-jess-muted">
          Next payment due: {new Date(subscription.current_period_ends_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};
