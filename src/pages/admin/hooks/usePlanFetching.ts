
import { useState, useEffect } from 'react';
import { useToast } from "../../../hooks/use-toast";
import { PlanType } from "../types/plans";
import { fetchPlansFromDB } from "../services/planService";
import { showErrorNotification } from "../utils/notificationUtils";

export const usePlanFetching = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      
      const { data, error, connectionError } = await fetchPlansFromDB();
      
      if (connectionError) {
        setConnectionError(true);
        return;
      }
      
      if (error) {
        showErrorNotification(
          toast, 
          "Error fetching plans", 
          error.message || "Please try again later"
        );
        return;
      }
      
      setPlans(data || []);
    } catch (error: any) {
      console.error('Error in fetchPlans:', error);
      setConnectionError(true);
      showErrorNotification(
        toast, 
        "Error fetching plans", 
        error.message || "Please try again later"
      );
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
