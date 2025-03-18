
import React, { useState, useEffect } from 'react';
import { supabase } from "../../../integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "../../../components/ui/dialog";
import { useToast } from "../../../hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface PlanType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  is_active: boolean | null;
}

export const PlanManagement = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanType | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    interval: 'month',
    is_active: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      console.log("Fetching plans from database...");
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plans:', error);
        throw error;
      }
      
      console.log("Plans fetched:", data);
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error fetching plans",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (plan: PlanType) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      interval: plan.interval,
      is_active: plan.is_active || false
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      interval: 'month',
      is_active: true
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      // Use intermediate variables to avoid type recursion issues
      const response = await supabase
        .from('payment_plans')
        .delete()
        .eq('id', id);
      
      const error = response.error;
      
      if (error) {
        console.error('Error deleting plan:', error);
        throw error;
      }
      
      toast({
        title: "Plan deleted",
        description: "The plan has been successfully deleted",
      });
      
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error deleting plan",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPlan) {
        // Update existing plan
        const response = await supabase
          .from('payment_plans')
          .update({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            interval: formData.interval,
            is_active: formData.is_active
          })
          .eq('id', editingPlan.id);

        const error = response.error;
        
        if (error) {
          console.error('Error updating plan:', error);
          throw error;
        }
        
        toast({
          title: "Plan updated",
          description: "The plan has been successfully updated",
        });
      } else {
        // Add new plan
        const response = await supabase
          .from('payment_plans')
          .insert({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            interval: formData.interval,
            is_active: formData.is_active
          });

        const error = response.error;
        
        if (error) {
          console.error('Error creating plan:', error);
          throw error;
        }
        
        toast({
          title: "Plan added",
          description: "The new plan has been successfully added",
        });
      }
      
      setIsDialogOpen(false);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error saving plan",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payment Plans</CardTitle>
            <CardDescription>Manage subscription plans</CardDescription>
          </div>
          <Button onClick={handleAdd} size="sm">
            <Plus size={16} className="mr-2" />
            Add Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-4 text-jess-muted">No plans found. Create your first plan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-jess-subtle">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Interval</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id} className="border-b border-jess-subtle">
                    <td className="px-4 py-3">{plan.name}</td>
                    <td className="px-4 py-3">{plan.description || '-'}</td>
                    <td className="px-4 py-3">${(plan.price / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">{plan.interval}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)}>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
              <DialogDescription>
                {editingPlan 
                  ? 'Update the details of the existing plan.' 
                  : 'Create a new subscription plan.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (in cents)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-jess-muted">Enter price in cents (e.g., 1499 for $14.99)</p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="interval">Billing Interval</Label>
                  <select 
                    id="interval"
                    name="interval"
                    value={formData.interval}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-jess-subtle px-3 py-2"
                    required
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                    <option value="week">Weekly</option>
                    <option value="day">Daily</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPlan ? 'Update Plan' : 'Add Plan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
