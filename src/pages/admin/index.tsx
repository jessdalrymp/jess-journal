
import React, { useState, useEffect } from 'react';
import { Header } from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { AdminHeader } from "./components/AdminHeader";
import { supabase } from "../../integrations/supabase/client";
import { PlanManagement } from "./components/PlanManagement";
import { CouponManagement } from "./components/CouponManagement";
import { UserManagement } from "./components/UserManagement";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { DisclaimerBanner } from "../../components/ui/DisclaimerBanner";

const AdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      console.log("Checking admin status for user:", user.id);
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      console.log("Checking admin status...");
      // Call the Postgres function via RPC with proper typing
      const { data, error } = await supabase.rpc('check_is_admin');
      
      if (error) {
        console.error("Error checking admin status:", error);
        return;
      }
      
      console.log("Admin status check result:", data);
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
      console.log("Attempting to make user admin...");
      // Call the Postgres function via RPC with proper typing
      const { data, error } = await supabase.rpc('make_user_admin');

      if (error) {
        console.error("Error making admin:", error);
        toast({
          title: "Error",
          description: "Failed to set admin role. " + error.message,
          variant: "destructive"
        });
        return;
      }

      console.log("Make admin result:", data);
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

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto max-w-7xl">
        <AdminHeader />
        
        {isLoading ? (
          <div className="text-center py-10">Loading...</div>
        ) : isAdmin ? (
          <div className="grid gap-6 mt-6">
            <UserManagement />
            <PlanManagement />
            <CouponManagement />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-xl font-medium mb-4">Admin Access</h2>
            <p className="mb-4">You need admin privileges to access this page.</p>
            <Button onClick={makeAdmin}>
              Make Me Admin
            </Button>
          </div>
        )}
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default AdminPage;
