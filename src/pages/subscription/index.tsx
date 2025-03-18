
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "../../components/Header";
import { DisclaimerBanner } from "../../components/ui/DisclaimerBanner";
import { useAuth } from "../../context/AuthContext";
import { useUserData } from "../../context/UserDataContext";
import { PageHeader } from "./components/PageHeader";
import { SubscriptionStatusCard } from "./components/SubscriptionStatusCard";
import { SubscriptionPlansCard } from "./components/SubscriptionPlansCard";
import { CouponRedemptionCard } from "./components/CouponRedemptionCard";
import { useState, useEffect } from "react";
import { useToast } from "../../hooks/use-toast";

const Subscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const { subscription, checkSubscriptionStatus } = useUserData();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    }
    
    // Check for success parameter in URL
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Payment successful!",
        description: "Your subscription has been activated",
      });
    }
  }, [user, checkSubscriptionStatus, location, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto max-w-4xl">
        <PageHeader />
        
        <div className="grid gap-6">
          <SubscriptionStatusCard 
            subscription={subscription} 
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
          
          <SubscriptionPlansCard 
            subscription={subscription}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
          
          <CouponRedemptionCard />
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default Subscription;
