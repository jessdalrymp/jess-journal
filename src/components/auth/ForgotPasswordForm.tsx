import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail } from '../../utils/authValidation';
import { Input } from '../ui/input';
import { ActionButton } from '../ui/ActionButton';
import { ErrorMessage } from './ErrorMessage';
import { usePasswordReset } from '../../hooks/auth/usePasswordReset';
import { isRateLimited } from '../../utils/email/rateLimitDetection';

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
      const result = await resetPassword(email);
      
      if (result) {
        console.log("Reset email sent successfully");
        onSuccess(email);
      } 
      // If result is false, the hook already displayed an appropriate toast
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      // Use improved rate limit detection
      if (isRateLimited(error.message)) {
        setError("Please wait a moment before requesting another password reset.");
      } else if (error.message?.includes("sending email") || error.message?.includes("smtp") || error.message?.includes("host")) {
        setError("We're having trouble sending emails right now. Please try again later.");
      } else {
        setError(error.message || "Failed to send reset email. Please try again.");
      }
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
