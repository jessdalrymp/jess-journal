
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useAdminStatus } from "../hooks/useAdminStatus";
import { supabase } from "../../../integrations/supabase/client";
import { useToast } from "../../../hooks/use-toast";

export const AdminHeader = () => {
  const { isAdmin, loading, checkAdminStatus } = useAdminStatus();
  const { toast } = useToast();

  const makeAdmin = async () => {
    try {
      const { data, error } = await supabase.rpc('make_user_admin');
      
      if (error) {
        console.error("Error making admin:", error);
        toast({
          title: "Error",
          description: "Failed to set admin role: " + error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data === true) {
        toast({
          title: "Success",
          description: "You are now an administrator",
        });
        // Refresh admin status
        await checkAdminStatus();
      } else {
        toast({
          title: "Warning",
          description: "The operation completed but admin status was not changed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in makeAdmin:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          {loading ? "Checking permissions..." : 
           isAdmin ? "You have administrator access" : 
           "You do not have administrator access"}
        </p>
      </div>
      
      {!isAdmin && !loading && (
        <Button onClick={makeAdmin} variant="secondary">
          <ShieldCheck className="mr-2 h-4 w-4" />
          Make Me Admin
        </Button>
      )}
    </div>
  );
};
