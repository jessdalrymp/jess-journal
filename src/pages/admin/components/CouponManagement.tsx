
import React, { useState, useEffect } from 'react';
import { supabase } from "../../../integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "../../../components/ui/dialog";
import { useToast } from "../../../hooks/use-toast";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";
import { format } from "date-fns";

interface CouponType {
  id: string;
  code: string;
  description: string | null;
  discount_percent: number | null;
  discount_amount: number | null;
  expires_at: string | null;
  max_uses: number | null;
  current_uses: number | null;
  is_active: boolean | null;
  is_unlimited: boolean | null;
}

export const CouponManagement = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponType | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_percent: 0,
    discount_amount: 0,
    expires_at: '',
    max_uses: 0,
    is_active: true,
    is_unlimited: false
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: "Error fetching coupons",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'discount_percent' || name === 'discount_amount' || name === 'max_uses') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleEdit = (coupon: CouponType) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_percent: coupon.discount_percent || 0,
      discount_amount: coupon.discount_amount || 0,
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : '',
      max_uses: coupon.max_uses || 0,
      is_active: coupon.is_active || false,
      is_unlimited: coupon.is_unlimited || false
    });
    setIsDialogOpen(true);
  };

  const handleDuplicate = (coupon: CouponType) => {
    setEditingCoupon(null); // We're creating a new coupon, but based on an existing one
    const newCode = `${coupon.code}_COPY`;
    setFormData({
      code: newCode,
      description: coupon.description || '',
      discount_percent: coupon.discount_percent || 0,
      discount_amount: coupon.discount_amount || 0,
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : '',
      max_uses: coupon.max_uses || 0,
      is_active: true, // Default to active for the new coupon
      is_unlimited: coupon.is_unlimited || false
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discount_percent: 0,
      discount_amount: 0,
      expires_at: '',
      max_uses: 0,
      is_active: true,
      is_unlimited: false
    });
    setIsDialogOpen(true);
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like 0,O,1,I
    let result = '';
    const length = 8;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Coupon deleted",
        description: "The coupon has been successfully deleted",
      });
      
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Error deleting coupon",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const couponData = {
        code: formData.code,
        description: formData.description,
        discount_percent: formData.discount_percent || null,
        discount_amount: formData.discount_amount || null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        max_uses: formData.is_unlimited ? null : formData.max_uses || null,
        is_active: formData.is_active,
        is_unlimited: formData.is_unlimited
      };

      if (editingCoupon) {
        // Update existing coupon
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);

        if (error) throw error;
        
        toast({
          title: "Coupon updated",
          description: "The coupon has been successfully updated",
        });
      } else {
        // Add new coupon
        const { error } = await supabase
          .from('coupons')
          .insert(couponData);

        if (error) throw error;
        
        toast({
          title: "Coupon added",
          description: "The new coupon has been successfully added",
        });
      }
      
      setIsDialogOpen(false);
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast({
        title: "Error saving coupon",
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
            <CardTitle>Coupon Management</CardTitle>
            <CardDescription>Manage discount coupons</CardDescription>
          </div>
          <Button onClick={handleAdd} size="sm">
            <Plus size={16} className="mr-2" />
            Add Coupon
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-4 text-jess-muted">No coupons found. Create your first coupon.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-jess-subtle">
                  <th className="px-4 py-2 text-left">Code</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Discount</th>
                  <th className="px-4 py-2 text-left">Expires</th>
                  <th className="px-4 py-2 text-left">Usage</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="border-b border-jess-subtle">
                    <td className="px-4 py-3 font-medium">{coupon.code}</td>
                    <td className="px-4 py-3">{coupon.description || '-'}</td>
                    <td className="px-4 py-3">
                      {coupon.discount_percent ? `${coupon.discount_percent}%` : ''}
                      {coupon.discount_amount ? `$${(coupon.discount_amount / 100).toFixed(2)}` : ''}
                      {!coupon.discount_percent && !coupon.discount_amount ? 'Special' : ''}
                    </td>
                    <td className="px-4 py-3">
                      {coupon.expires_at ? format(new Date(coupon.expires_at), 'MMM dd, yyyy') : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      {coupon.is_unlimited 
                        ? 'Unlimited' 
                        : `${coupon.current_uses || 0} / ${coupon.max_uses || 'Unlimited'}`}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(coupon)}>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicate(coupon)}>
                          <Copy size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(coupon.id)}>
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
              <DialogDescription>
                {editingCoupon 
                  ? 'Update the details of the existing coupon.' 
                  : 'Create a new discount coupon.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label htmlFor="code">Coupon Code</Label>
                      <Input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="mt-7">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={generateRandomCode}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discount_percent">Discount %</Label>
                    <Input
                      id="discount_percent"
                      name="discount_percent"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount_percent}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="discount_amount">Discount Amount (cents)</Label>
                    <Input
                      id="discount_amount"
                      name="discount_amount"
                      type="number"
                      min="0"
                      value={formData.discount_amount}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expires_at">Expiration Date</Label>
                  <Input
                    id="expires_at"
                    name="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-jess-muted">Leave blank for no expiration</p>
                </div>
                
                <div className="flex items-center justify-between space-y-0 py-2">
                  <Label htmlFor="is_unlimited">Unlimited Uses</Label>
                  <Switch
                    id="is_unlimited"
                    checked={formData.is_unlimited}
                    onCheckedChange={(checked) => handleSwitchChange('is_unlimited', checked)}
                  />
                </div>
                
                {!formData.is_unlimited && (
                  <div className="grid gap-2">
                    <Label htmlFor="max_uses">Maximum Uses</Label>
                    <Input
                      id="max_uses"
                      name="max_uses"
                      type="number"
                      min="0"
                      value={formData.max_uses}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between space-y-0 py-2">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
