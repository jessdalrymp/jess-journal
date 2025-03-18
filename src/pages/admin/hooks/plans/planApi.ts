
import { supabase } from "../../../../integrations/supabase/client";
import { useToast } from "../../../../hooks/use-toast";
import { PlanType } from "./types";

export const usePlanApi = () => {
  const { toast } = useToast();

  const fetchPlans = async (): Promise<PlanType[]> => {
    try {
      console.log('Fetching payment plans...');
      
      // Check if the payment_plans table exists
      const { data: tableInfo, error: tableError } = await supabase
        .from('payment_plans')
        .select('*')
        .limit(1);
        
      if (tableError) {
        console.error('Error fetching plans (may need to create table):', tableError);
        // If table doesn't exist, we'll create a temporary empty array
        if (tableError.code === '42P01') { // PostgreSQL code for undefined_table
          console.log('Table payment_plans does not exist');
          return [];
        }
        throw tableError;
      }
      
      console.log('Payment plans table exists, fetching data...');
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*');

      if (error) {
        console.error('Error fetching plans:', error);
        throw error;
      }
      
      console.log('Payment plans data:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error fetching plans",
        description: "Please try again later",
        variant: "destructive"
      });
      return [];
    }
  };

  const deletePlan = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('payment_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Plan deleted",
        description: "The plan has been successfully deleted",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error deleting plan",
        description: "Please try again later",
        variant: "destructive"
      });
      return false;
    }
  };

  const updatePlan = async (id: string, planData: Omit<PlanType, 'id'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('payment_plans')
        .update(planData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Plan updated",
        description: "The plan has been successfully updated",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error saving plan",
        description: "Please try again later",
        variant: "destructive"
      });
      return false;
    }
  };

  const createPlan = async (planData: Omit<PlanType, 'id'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('payment_plans')
        .insert(planData);

      if (error) throw error;
      
      toast({
        title: "Plan added",
        description: "The new plan has been successfully added",
      });
      
      return true;
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Error saving plan",
        description: "Please try again later",
        variant: "destructive"
      });
      return false;
    }
  };

  const createSamplePlans = async (): Promise<boolean> => {
    try {
      const samplePlans = [
        {
          name: "Monthly Plan",
          description: "Access to all features on a monthly billing cycle",
          price: 999, // $9.99
          interval: "month",
          is_active: true
        },
        {
          name: "Annual Plan",
          description: "Save 16% with yearly billing",
          price: 9999, // $99.99
          interval: "year",
          is_active: true
        },
        {
          name: "Weekly Plan",
          description: "Try out all features for a short period",
          price: 299, // $2.99
          interval: "week",
          is_active: false
        }
      ];

      const { error } = await supabase
        .from('payment_plans')
        .insert(samplePlans);

      if (error) throw error;
      
      toast({
        title: "Sample plans created",
        description: "Sample payment plans have been successfully added",
      });
      
      return true;
    } catch (error) {
      console.error('Error creating sample plans:', error);
      toast({
        title: "Error creating sample plans",
        description: "Please try again later",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    fetchPlans,
    deletePlan,
    updatePlan,
    createPlan,
    createSamplePlans
  };
};
