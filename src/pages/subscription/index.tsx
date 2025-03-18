
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
import { Alert, AlertDescription } from "../../components/ui/alert";
import { InfoIcon } from "lucide-react";

const Subscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const { subscription, checkSubscriptionStatus } = useUserData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          await checkSubscriptionStatus();
        } catch (error) {
          console.error("Error checking subscription:", error);
          setHasError(true);
        }
      };
      
      fetchData();
    }
    
    // Check for success parameter in URL
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Payment successful!",
        description: "Your subscription has been activated",
      });
    }
  }, [user, location, toast, checkSubscriptionStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto max-w-4xl">
        <PageHeader />
        
        {hasError && (
          <Alert variant="destructive" className="mb-6">
            <InfoIcon className="h-4 w-4 mr-2" />
            <AlertDescription>
              There was an issue loading your subscription data. Please refresh the page or try again later.
            </AlertDescription>
          </Alert>
        )}
        
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
