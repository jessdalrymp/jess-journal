
import { Link } from 'react-router-dom';
import { User, ArrowRight, CreditCard, AlertCircle } from 'lucide-react';
import { useUserData } from '../../../context/UserDataContext';

export const AccountSection = () => {
  const { subscription } = useUserData();

  const renderSubscriptionStatus = () => {
    if (!subscription) {
      return (
        <div className="mt-3">
          <p className="text-sm text-jess-muted">No active subscription</p>
        </div>
      );
    }

    if (subscription.is_unlimited) {
      return (
        <div className="mt-3">
          <p className="text-sm font-medium text-jess-primary">Unlimited Access</p>
        </div>
      );
    }

    if (subscription.is_trial) {
      const trialEndDate = new Date(subscription.trial_ends_at || '');
      const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
      
      return (
        <div className="mt-3">
          <p className={`text-sm font-medium ${daysLeft <= 2 ? 'text-jess-accent flex items-center' : 'text-jess-primary'}`}>
            {daysLeft <= 2 && <AlertCircle size={14} className="mr-1" />}
            Trial Active - {daysLeft} days left
          </p>
        </div>
      );
    }

    return (
      <div className="mt-3">
        <p className="text-sm font-medium text-jess-primary">
          Subscription: {subscription.status}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl font-medium mb-5 bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">Account</h2>
      
      <Link to="/account">
        <div className="bg-gradient-to-r from-jess-subtle/80 to-white rounded-lg p-4 flex items-center justify-between cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-r hover:from-jess-secondary/60 hover:to-white">
          <div className="flex items-center">
            <User size={20} className="text-jess-primary mr-3" />
            <span>Manage your account</span>
          </div>
          <ArrowRight size={18} className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>

      <Link to="/subscription" className="block mt-4">
        <div className="bg-gradient-to-r from-jess-subtle/80 to-white rounded-lg p-4 flex items-center justify-between cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-r hover:from-jess-secondary/60 hover:to-white">
          <div className="flex items-center">
            <CreditCard size={20} className="text-jess-primary mr-3" />
            <div>
              <span>Subscription</span>
              {renderSubscriptionStatus()}
            </div>
          </div>
          <ArrowRight size={18} className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </div>
  );
};
