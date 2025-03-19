
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail } from '../../utils/authValidation';
import { Input } from '../ui/input';
import { ActionButton } from '../ui/ActionButton';
import { ErrorMessage } from './ErrorMessage';
import { usePasswordReset } from '../../hooks/auth/usePasswordReset';

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { resetPassword: authResetPassword } = useAuth();
  const { resetPassword, loading: resetLoading } = usePasswordReset();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Attempting to send reset email to:", email);
      // Use the direct hook implementation rather than going through context
      await resetPassword(email);
      console.log("Reset email sent successfully");
      onSuccess(email);
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      // Set error message based on the type of error
      if (error.message?.includes("rate limit") || error.message?.includes("429")) {
        setError("Too many requests. Please try again after a few minutes.");
      } else if (error.message?.includes("sending email") || error.message?.includes("smtp") || error.message?.includes("host")) {
        setError("We're having trouble sending emails right now. Please try again later or contact support.");
      } else {
        setError(error.message || "Failed to send reset email. Please try again.");
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="relative">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 bg-jess-subtle text-jess-foreground"
          placeholder="you@example.com"
          required
        />
        <Mail className="absolute left-3 top-3 h-4 w-4 text-jess-muted" />
      </div>
      
      <ErrorMessage error={error} />
      
      <div className="pt-2">
        <ActionButton 
          type="primary" 
          className="w-full py-3"
          disabled={loading || resetLoading}
        >
          {loading || resetLoading ? 'Sending...' : 'Send Reset Link'}
        </ActionButton>
      </div>
    </form>
  );
};
