
import React, { useState, useEffect } from 'react';
import { Header } from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { AdminHeader } from "./components/AdminHeader";
import { supabase } from "../../integrations/supabase/client";
import { PlanManagement } from "./components/PlanManagement";
import { CouponManagement } from "./components/CouponManagement";
import { UserManagement } from "./components/UserManagement";
import { SubscriptionManagement } from "./components/SubscriptionManagement";
import { PaymentManagement } from "./components/PaymentManagement";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { DisclaimerBanner } from "../../components/ui/DisclaimerBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const AdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      // Call the Postgres function via RPC with proper typing
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
      // Call the Postgres function via RPC with proper typing
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

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto max-w-5xl">
        <AdminHeader />
        
        {isLoading ? (
          <div className="text-center py-10">Loading...</div>
        ) : isAdmin ? (
          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="plans">Plans</TabsTrigger>
                <TabsTrigger value="coupons">Coupons</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="mt-0">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="subscriptions" className="mt-0">
                <SubscriptionManagement />
              </TabsContent>
              
              <TabsContent value="payments" className="mt-0">
                <PaymentManagement />
              </TabsContent>
              
              <TabsContent value="plans" className="mt-0">
                <PlanManagement />
              </TabsContent>
              
              <TabsContent value="coupons" className="mt-0">
                <CouponManagement />
              </TabsContent>
            </Tabs>
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
