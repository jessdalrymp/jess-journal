
import React from 'react';
import { Badge } from "../../../../components/ui/badge";

interface SubscriptionType {
  status: string;
  is_trial: boolean | null;
  is_unlimited: boolean | null;
  trial_ends_at?: string | null;
  current_period_ends_at?: string | null;
}

interface UserSubscriptionBadgeProps {
  subscription?: SubscriptionType;
}

export const UserSubscriptionBadge = ({ subscription }: UserSubscriptionBadgeProps) => {
  const getSubscriptionBadgeVariant = (status?: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trial':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const formatSubscriptionStatus = () => {
    if (!subscription) return 'None';
    
    if (subscription.is_unlimited) {
      return 'Unlimited';
    }
    
    if (subscription.is_trial) {
      return 'Trial';
    }
    
    return subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
  };

  return (
    <div>
      <Badge variant={getSubscriptionBadgeVariant(subscription?.status)}>
        {formatSubscriptionStatus()}
      </Badge>
      {subscription?.current_period_ends_at && (
        <div className="text-xs text-jess-muted mt-1">
          Ends: {new Date(subscription.current_period_ends_at).toLocaleDateString()}
        </div>
      )}
      {subscription?.trial_ends_at && subscription.is_trial && (
        <div className="text-xs text-jess-muted mt-1">
          Trial ends: {new Date(subscription.trial_ends_at).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};
