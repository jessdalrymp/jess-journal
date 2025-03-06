
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft, Check, CreditCard, Gift, ShieldCheck, Clock, AlertCircle } from "lucide-react";
import { useUserData } from "../context/UserDataContext";
import { supabase } from "../integrations/supabase/client";

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

  const renderSubscriptionStatus = () => {
    if (!subscription) {
      return (
        <div className="text-center p-4 bg-jess-subtle rounded-lg">
          <p>You don't have an active subscription</p>
        </div>
      );
    }

    if (subscription.status === "active" && subscription.is_unlimited) {
      return (
        <div className="bg-jess-subtle p-4 rounded-lg">
          <h3 className="font-medium text-jess-primary mb-2 flex items-center">
            <ShieldCheck size={18} className="mr-2" />
            Unlimited Access
          </h3>
          <p className="text-jess-muted">You have unlimited access to all features!</p>
        </div>
      );
    }

    if (subscription.status === "active" && subscription.is_trial) {
      const trialEndDate = new Date(subscription.trial_ends_at);
      const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
      
      return (
        <div className="bg-jess-subtle p-4 rounded-lg">
          <h3 className="font-medium text-jess-primary mb-2 flex items-center">
            <Clock size={18} className="mr-2" />
            Trial Active
          </h3>
          <p className="text-jess-muted">Your trial ends in {daysLeft} days on {trialEndDate.toLocaleDateString()}</p>
          {daysLeft <= 2 && (
            <div className="mt-3 p-3 bg-jess-accent/10 rounded-md border border-jess-accent">
              <p className="text-sm text-jess-accent font-medium flex items-start">
                <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                Your trial is ending soon! Subscribe now to continue using premium features.
              </p>
              <Button 
                onClick={handleInitiatePayment} 
                className="mt-2 w-full"
                disabled={isProcessing}
              >
                Subscribe Now
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-jess-subtle p-4 rounded-lg">
        <h3 className="font-medium text-jess-primary mb-2 flex items-center">
          <CreditCard size={18} className="mr-2" />
          Subscription: {subscription.status}
        </h3>
        {subscription.current_period_ends_at && (
          <p className="text-jess-muted">
            Next payment due: {new Date(subscription.current_period_ends_at).toLocaleDateString()}
          </p>
        )}
      </div>
    );
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
              {renderSubscriptionStatus()}
            </CardContent>
          </Card>
          
          {/* Subscription Options */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Choose the plan that works for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border border-jess-subtle rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-medium text-jess-primary mb-4">Premium Plan</h3>
                <p className="text-3xl font-bold mb-4">$14.99<span className="text-sm font-normal text-jess-muted">/month</span></p>
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <Check size={18} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Unlimited conversations with Jess</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Exclusive journal insight reports</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Priority access to new features</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={18} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>7-day free trial</span>
                  </li>
                </ul>
                
                {!subscription ? (
                  <Button 
                    className="w-full" 
                    onClick={handleStartTrial}
                    disabled={isProcessing}
                  >
                    Start 7-Day Free Trial
                  </Button>
                ) : subscription.is_trial ? (
                  <Button 
                    className="w-full" 
                    onClick={handleInitiatePayment}
                    disabled={isProcessing}
                  >
                    Subscribe Now
                  </Button>
                ) : subscription.status === "active" ? (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled
                  >
                    Already Subscribed
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={handleInitiatePayment}
                    disabled={isProcessing}
                  >
                    Renew Subscription
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Coupon Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift size={20} className="mr-2" />
                Redeem Coupon
              </CardTitle>
              <CardDescription>Enter a coupon code to get special offers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="grid gap-2 flex-1">
                  <Label htmlFor="couponCode">Coupon Code</Label>
                  <Input 
                    id="couponCode"
                    placeholder="Enter coupon code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
                <div className="self-end">
                  <Button 
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    variant="outline"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default Subscription;
