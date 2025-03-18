
interface User {
  id: string;
  email: string;
  created_at: string;
  profile_data: any;
  subscription_data: any;
  is_admin: boolean;
}

export const useSubscriptionHelpers = () => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubscriptionStatus = (user: User) => {
    if (!user.subscription_data) return 'None';
    
    if (user.subscription_data.is_unlimited) return 'Unlimited';
    if (user.subscription_data.is_trial) return 'Trial';
    if (user.subscription_data.status === 'active') return 'Active';
    
    return user.subscription_data.status || 'None';
  };

  const getSubscriptionExpiry = (user: User) => {
    if (!user.subscription_data) return 'N/A';
    
    if (user.subscription_data.is_unlimited) return 'Never';
    if (user.subscription_data.is_trial && user.subscription_data.trial_ends_at) {
      return formatDate(user.subscription_data.trial_ends_at);
    }
    if (user.subscription_data.current_period_ends_at) {
      return formatDate(user.subscription_data.current_period_ends_at);
    }
    
    return 'N/A';
  };

  return {
    formatDate,
    getSubscriptionStatus,
    getSubscriptionExpiry
  };
};
