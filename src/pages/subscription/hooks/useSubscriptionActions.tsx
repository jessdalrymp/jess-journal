
import { useAuth } from "../../../context/AuthContext";
import { useUserData } from "../../../context/UserDataContext";
import { useToast } from "../../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../integrations/supabase/client";

export const useSubscriptionActions = (
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkSubscriptionStatus } = useUserData();

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

  return {
    handleStartTrial,
    handleInitiatePayment
  };
};
