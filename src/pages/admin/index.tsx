import React, { useState, useEffect } from 'react';
import { Header } from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { AdminHeader } from "./components/AdminHeader";
import { supabase } from "../../integrations/supabase/client";
import { PlanManagement } from "./components/PlanManagement";
import { CouponManagement } from "./components/CouponManagement";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { DisclaimerBanner } from "../../components/ui/DisclaimerBanner";
import { AdminDashboard } from "./components/AdminDashboard";

const AdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('check_is_admin', {}) as 
        { data: boolean | null, error: Error | null };
      
      if (error) {
        console.error("Error checking admin status:", error);
        return;
      }
      
      setIsAdmin(data === true);
    } catch (error) {
      console.error("Error checking admin status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const makeAdmin = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('make_user_admin', {}) as 
        { data: boolean | null, error: Error | null };

      if (error) {
        console.error("Error making admin:", error);
        toast({
          title: "Error",
          description: "Failed to set admin role. " + error.message,
          variant: "destructive"
        });
        return;
      }

      if (data === true) {
        setIsAdmin(true);
        toast({
          title: "Success",
          description: "You are now an administrator",
        });
      }
    } catch (error) {
      console.error("Error making admin:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-jess-background">
        <Header />
        <main className="flex-1 py-6 container mx-auto">
          <h1 className="text-2xl font-medium mb-4">Admin Panel</h1>
          <p>Please login to access the admin panel.</p>
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminPage;
