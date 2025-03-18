
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanManagement } from "./PlanManagement";
import { CouponManagement } from "./CouponManagement";
import { UserManagement } from "./UserManagement";
import { PaymentManagement } from "./PaymentManagement";
import DatabaseConnectionTest from "@/components/DatabaseConnectionTest";
import { AdminHeader } from "./AdminHeader";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("plans");

  return (
    <div className="container mx-auto py-8">
      <AdminHeader />
      
      <div className="grid gap-6">
        <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="plans">Payment Plans</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="mt-6">
            <PlanManagement />
          </TabsContent>
          
          <TabsContent value="coupons" className="mt-6">
            <CouponManagement />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="payments" className="mt-6">
            <PaymentManagement />
          </TabsContent>
        </Tabs>
        
        <Card className="shadow-sm">
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
      </div>
    </div>
  );
};
