
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanManagement } from "./PlanManagement";
import { CouponManagement } from "./CouponManagement";
import DatabaseConnectionTest from "@/components/DatabaseConnectionTest";
import { AdminHeader } from "./AdminHeader";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("plans");

  return (
    <div className="container mx-auto py-8">
      <AdminHeader />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Status</CardTitle>
            <CardDescription>
              Check connectivity to important database tables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DatabaseConnectionTest />
          </CardContent>
        </Card>
        
        <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="plans">Payment Plans</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="mt-6">
            <PlanManagement />
          </TabsContent>
          
          <TabsContent value="coupons" className="mt-6">
            <CouponManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
