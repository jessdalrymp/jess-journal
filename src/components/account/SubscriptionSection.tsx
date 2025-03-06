
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { Button } from "../ui/button";
import { Subscription } from "../../context/types";

interface SubscriptionSectionProps {
  subscription: Subscription | null;
}

export const SubscriptionSection = ({ subscription }: SubscriptionSectionProps) => {
  const navigate = useNavigate();

  if (!subscription) {
    return (
      <div className="p-4 border border-jess-subtle rounded-lg">
        <h3 className="font-medium mb-3 flex items-center">
          <CreditCard size={18} className="mr-2" />
          Subscription
        </h3>
        <p className="text-sm text-jess-muted mb-2">You don't have an active subscription.</p>
        <Button 
          variant="outline" 
          size="sm"
          className="mt-2"
          onClick={() => navigate('/subscription')}
        >
          View Subscription Options
        </Button>
      </div>
    );
  }

  if (subscription.is_unlimited) {
    return (
      <div className="p-4 border border-jess-subtle rounded-lg">
        <h3 className="font-medium mb-3 flex items-center">
          <CreditCard size={18} className="mr-2" />
          Subscription
        </h3>
        <p className="text-sm text-jess-muted mb-2">
          <span className="font-medium text-jess-primary">Unlimited Access</span>
        </p>
        {subscription.coupon_code && (
          <p className="text-xs text-jess-muted">Applied coupon: {subscription.coupon_code}</p>
        )}
        <Button 
          variant="outline" 
          size="sm"
          className="mt-2"
          onClick={() => navigate('/subscription')}
        >
          Manage Subscription
        </Button>
      </div>
    );
  }

  if (subscription.is_trial) {
    const trialEndDate = new Date(subscription.trial_ends_at || '');
    const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    
    return (
      <div className="p-4 border border-jess-subtle rounded-lg">
        <h3 className="font-medium mb-3 flex items-center">
          <CreditCard size={18} className="mr-2" />
          Trial Subscription
        </h3>
        <p className="text-sm text-jess-muted mb-2">Your trial ends in {daysLeft} days ({trialEndDate.toLocaleDateString()}).</p>
        {daysLeft <= 3 && (
          <p className="text-sm text-jess-accent font-medium mb-2">
            Your trial is ending soon! Please renew to continue using premium features.
          </p>
        )}
        <Button 
          variant="outline" 
          size="sm"
          className="mt-2"
          onClick={() => navigate('/subscription')}
        >
          Manage Subscription
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 border border-jess-subtle rounded-lg">
      <h3 className="font-medium mb-3 flex items-center">
        <CreditCard size={18} className="mr-2" />
        Subscription
      </h3>
      <p className="text-sm text-jess-muted mb-2">Status: {subscription.status}</p>
      {subscription.current_period_ends_at && (
        <p className="text-sm text-jess-muted mb-2">
          Next payment due: {new Date(subscription.current_period_ends_at).toLocaleDateString()}
        </p>
      )}
      <Button 
        variant="outline" 
        size="sm"
        className="mt-2"
        onClick={() => navigate('/subscription')}
      >
        Manage Subscription
      </Button>
    </div>
  );
};
