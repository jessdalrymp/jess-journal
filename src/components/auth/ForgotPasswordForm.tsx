
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail } from '../../utils/authValidation';
import { Input } from '../ui/input';
import { ActionButton } from '../ui/ActionButton';
import { AlertCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { resetPassword } = useAuth();
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
      await resetPassword(email);
      console.log("Reset email sent successfully");
      onSuccess(email);
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      // Check for rate limit errors
      if (error.message?.includes("rate limit") || error.message?.includes("429")) {
        setError("Too many requests. Please try again after a few minutes.");
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
      
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 text-red-700 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="pt-2">
        <ActionButton 
          type="primary" 
          className="w-full py-3"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </ActionButton>
      </div>
    </form>
  );
};
