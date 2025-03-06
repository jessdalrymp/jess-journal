
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useUserData } from "../context/UserDataContext";
import { supabase } from "../integrations/supabase/client";
import { SubscriptionStatus } from "../components/subscription/SubscriptionStatus";
import { PricingPlan } from "../components/subscription/PricingPlan";
import { CouponRedemption } from "../components/subscription/CouponRedemption";

const Subscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { subscription, checkSubscriptionStatus, applyCoupon } = useUserData();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
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

  const handleStartTrial = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to start a trial",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("start-trial", {
        body: { userId: user.id }
      });

      if (error) throw error;

      toast({
        title: "Trial started!",
        description: "Your 7-day free trial has been activated",
      });
      
      await checkSubscriptionStatus();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error starting trial:", error);
      toast({
        title: "Error starting trial",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Missing coupon code",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const success = await applyCoupon(couponCode.trim());
      if (success) {
        toast({
          title: "Coupon applied",
          description: "Your coupon has been applied successfully",
        });
        setCouponCode("");
        await checkSubscriptionStatus();
      } else {
        toast({
          title: "Invalid coupon",
          description: "This coupon code is invalid or expired",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast({
        title: "Error applying coupon",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleInitiatePayment = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to make a payment",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { userId: user.id, amount: 1499, currency: "USD", description: "Monthly subscription" }
      });

      if (error) throw error;

      // Redirect to payment URL from Square
      window.location.href = data.payment_url;
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast({
        title: "Error processing payment",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-medium">Subscription</h1>
        </div>
        
        <div className="grid gap-6">
          {/* Current Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>View your current subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionStatus 
                subscription={subscription} 
                handleInitiatePayment={handleInitiatePayment}
                isProcessing={isProcessing}
              />
            </CardContent>
          </Card>
          
          {/* Subscription Options */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Choose the plan that works for you</CardDescription>
            </CardHeader>
            <CardContent>
              <PricingPlan 
                subscription={subscription}
                handleStartTrial={handleStartTrial}
                handleInitiatePayment={handleInitiatePayment}
                isProcessing={isProcessing}
              />
            </CardContent>
          </Card>
          
          {/* Coupon Code */}
          <CouponRedemption 
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            handleApplyCoupon={handleApplyCoupon}
            isApplyingCoupon={isApplyingCoupon}
          />
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default Subscription;
