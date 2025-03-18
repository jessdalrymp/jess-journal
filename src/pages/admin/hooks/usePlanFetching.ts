
import { useState, useEffect } from 'react';
import { supabase } from "../../../integrations/supabase/client";
import { useToast } from "../../../hooks/use-toast";
import { PlanType } from "../types/plans";

export const usePlanFetching = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      
      // Check if the table exists first
      const { count, error: countError } = await supabase
        .from('payment_plans')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error checking payment_plans table:', countError);
        setConnectionError(true);
        return;
      }
      
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plans:', error);
        setConnectionError(true);
        return;
      }
      
      setPlans(data || []);
    } catch (error: any) {
      console.error('Error in fetchPlans:', error);
      setConnectionError(true);
      toast({
        title: "Error fetching plans",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    connectionError,
    fetchPlans
  };
};
