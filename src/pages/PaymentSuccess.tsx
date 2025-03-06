
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useUserData } from "../context/UserDataContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { checkSubscriptionStatus } = useUserData();
  
  useEffect(() => {
    // Refresh subscription status
    checkSubscriptionStatus();
    
    // Show success toast
    toast({
      title: "Payment Successful",
      description: "Thank you for your subscription!",
    });
  }, [checkSubscriptionStatus, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-12 container mx-auto max-w-md flex items-center justify-center">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600 w-8 h-8" />
            </div>
            <CardTitle className="text-2xl">Payment Successful</CardTitle>
            <CardDescription>
              Thank you for subscribing to Jess AI
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Your subscription has been activated. You now have full access to all premium features.
            </p>
            <p className="text-sm text-jess-muted">
              Your next payment will be due in 30 days. We'll send you a notification before it's time to renew.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate("/dashboard")} className="mt-2">
              Continue to Dashboard
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default PaymentSuccess;
