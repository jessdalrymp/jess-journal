
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AuthFormInput } from './AuthFormInput';
import { ActionButton } from '../ui/ActionButton';
import { ForgotPasswordLink } from './ForgotPasswordLink';
import { ErrorMessage } from './ErrorMessage';
import { validateEmail, validatePassword } from '../../utils/authValidation';

interface LoginFormProps {
  onForgotPassword: () => void;
  onVerificationSent: (email: string) => void;
}

export const LoginForm = ({ onForgotPassword, onVerificationSent }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn } = useAuth();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    setError(null);
    
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return false;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      console.log("Attempting to sign in with:", { email });
      await signIn(email, password);
      console.log("Sign in successful");
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      // Expanded rate limit detection
      const isRateLimited = 
        error.message && (
          error.message.includes("rate limit") || 
          error.message.includes("429") || 
          error.message.includes("too many attempts") ||
          error.message.includes("try again later") ||
          error.message.includes("exceeded")
        );
      
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email to confirm your account before signing in.";
          onVerificationSent(email);
        } else if (isRateLimited) {
          errorMessage = "Too many attempts. Please try again after a few minutes.";
          
          toast({
            title: "Rate limit reached",
            description: "You've made too many login attempts. Please wait a few minutes before trying again.",
            duration: 8000,
            variant: "destructive",
          });
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      // Only show toast for non-rate limit errors to avoid double notifications
      if (!isRateLimited && !errorMessage.includes("Email not confirmed")) {
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthFormInput
        id="email"
        type="email"
        value={email}
        onChange={setEmail}
        label="Email"
        placeholder="you@example.com"
      />
      
      <AuthFormInput
        id="password"
        type="password"
        value={password}
        onChange={setPassword}
        label="Password"
        placeholder="••••••••"
      />
      
      <ErrorMessage error={error} />
      
      <ForgotPasswordLink onForgotPassword={onForgotPassword} />
      
      <div className="pt-2">
        <ActionButton 
          type="primary" 
          className="w-full py-3"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Sign In'}
        </ActionButton>
      </div>
    </form>
  );
};
