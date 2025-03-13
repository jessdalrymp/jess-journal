
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail } from '../../utils/authValidation';
import { Input } from '../ui/input';
import { ActionButton } from '../ui/ActionButton';

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await resetPassword(email);
      onSuccess(email);
    } catch (error: any) {
      let errorMessage = "Failed to send reset email. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
