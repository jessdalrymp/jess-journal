
import React, { useRef, createContext, useContext } from 'react';
import { User } from '../../lib/types';
import { Subscription } from '../../context/types';
import { useSubscription } from '../../hooks/useSubscription';

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  checkSubscriptionStatus: () => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<boolean>;
}

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  user: User | null;
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ user, children }) => {
  const isCheckingSubscriptionRef = useRef(false);
  const { 
    subscription, 
    loading: subscriptionLoading, 
    checkSubscriptionStatus: checkStatus, 
    applyCoupon: applyCode 
  } = useSubscription(user?.id);

  // Modified effect for subscription check to prevent loops
  React.useEffect(() => {
    if (user && !isCheckingSubscriptionRef.current) {
      console.log("Initial subscription check for user:", user.id);
      isCheckingSubscriptionRef.current = true;
      checkStatus()
        .then(() => {
          console.log("Subscription check completed");
        })
        .catch(error => {
          console.error("Error in subscription check:", error);
        })
        .finally(() => {
          isCheckingSubscriptionRef.current = false;
        });
    }
  }, [user, checkStatus]);

  // Modified applyCoupon wrapper to ensure subscription status is checked after
  const applyCoupon = async (couponCode: string): Promise<boolean> => {
    try {
      const result = await applyCode(couponCode);
      if (result) {
        console.log("Coupon applied, checking updated subscription status");
        isCheckingSubscriptionRef.current = true;
        await checkStatus();
        isCheckingSubscriptionRef.current = false;
      }
      return result;
    } catch (error) {
      console.error("Error in applyCoupon:", error);
      throw error;
    }
  };

  const value = {
    subscription,
    loading: subscriptionLoading,
    checkSubscriptionStatus: checkStatus,
    applyCoupon
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};
