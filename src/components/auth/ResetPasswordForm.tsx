import React, { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '../ui/input';
import { ActionButton } from '../ui/ActionButton';
import { ErrorMessage } from './ErrorMessage';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Call to supabase to update password
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      setError(error.message || "Failed to update password. Please try again.");
      
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (success) {
    return (
      <div className="space-y-4 py-4">
        <Alert className="bg-green-50 border-green-200">
          <AlertTriangle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Password Updated</AlertTitle>
          <AlertDescription className="text-green-700">
            Your password has been successfully updated. You can now sign in with your new password.
          </AlertDescription>
        </Alert>
        
        <div className="pt-2">
          <ActionButton 
            type="primary" 
            className="w-full py-3"
            onClick={() => window.location.href = "/"}
          >
            Return to Sign In
          </ActionButton>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4 py-4">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">Session Expired</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your password reset session has expired or is invalid. Please request a new password reset link.
          </AlertDescription>
        </Alert>
        
        <div className="pt-2">
          <ActionButton 
            type="primary" 
            className="w-full py-3"
            onClick={() => window.location.href = "/"}
          >
            Return to Sign In
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-3 bg-jess-subtle text-jess-foreground"
          placeholder="New password"
          required
        />
        <button 
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-3 text-jess-muted"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      
      <div className="relative">
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="pl-3 bg-jess-subtle text-jess-foreground"
          placeholder="Confirm new password"
          required
        />
      </div>
      
      <ErrorMessage error={error} />
      
      <div className="pt-2">
        <ActionButton 
          type="primary" 
          className="w-full py-3"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </ActionButton>
      </div>
    </form>
  );
};
