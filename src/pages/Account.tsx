
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { useAuth } from "../context/AuthContext";
import { useUserData } from "../context/UserDataContext";
import { Button } from "../components/ui/button";
import { ArrowLeft, User, Settings, LogOut, CreditCard } from "lucide-react";

const Account = () => {
  const { user, signOut } = useAuth();
  const { profile, subscription } = useUserData();
  const navigate = useNavigate();

  const renderSubscriptionInfo = () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-medium">Account</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center mb-6 pb-6 border-b border-jess-subtle">
            <div className="w-24 h-24 rounded-full bg-jess-subtle flex items-center justify-center mb-4">
              <User size={40} className="text-jess-primary" />
            </div>
            <h2 className="text-xl font-medium">{user?.name || 'User'}</h2>
            <p className="text-jess-muted">{user?.email}</p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border border-jess-subtle rounded-lg">
              <h3 className="font-medium mb-3 flex items-center">
                <Settings size={18} className="mr-2" />
                Profile Settings
              </h3>
              <p className="text-sm text-jess-muted mb-2">Email: {user?.email}</p>
              <p className="text-sm text-jess-muted">Member since: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
            
            {renderSubscriptionInfo()}
            
            {profile && (
              <div className="p-4 border border-jess-subtle rounded-lg">
                <h3 className="font-medium mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.growthStage && (
                    <div>
                      <p className="text-sm font-medium">Growth Stage</p>
                      <p className="text-sm text-jess-muted">{profile.growthStage}</p>
                    </div>
                  )}
                  {profile.learningStyle && (
                    <div>
                      <p className="text-sm font-medium">Learning Style</p>
                      <p className="text-sm text-jess-muted">{profile.learningStyle}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-8">
              <Button 
                variant="secondary" 
                className="w-full justify-center py-2"
                onClick={() => signOut()}
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default Account;
