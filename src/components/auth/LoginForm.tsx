
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AuthFormInput } from './AuthFormInput';
import { ErrorMessage } from './ErrorMessage';
import { ForgotPasswordLink } from './ForgotPasswordLink';
import { validateEmail, validatePassword } from '../../utils/authValidation';
import { isRateLimited } from '../../utils/email/rateLimitDetection';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
      
      // Use the improved rate limit detection
      const rateLimited = isRateLimited(error.message);
      
      if (rateLimited) {
        setError("Your account is temporarily locked due to multiple login attempts. Please wait a few minutes before trying again, or use the 'Forgot Password' option.");
        
        toast({
          title: "Account temporarily locked",
          description: "For your security, please wait a few minutes before trying again or reset your password.",
          duration: 8000,
        });
      } else if (error.message?.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else if (error.message?.includes("Email not confirmed")) {
        setError("Please check your email to confirm your account before signing in.");
        onVerificationSent(email);
      } else {
        setError(error.message || "An unexpected error occurred. Please try again.");
        
        toast({
          title: "Login failed",
          description: error.message || "An unexpected error occurred. Please try again.",
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
        disabled={loading}
      />
      
      <AuthFormInput
        id="password"
        type="password"
        value={password}
        onChange={setPassword}
        label="Password"
        placeholder="••••••••"
        disabled={loading}
      />
      
      <ErrorMessage error={error} />
      
      <ForgotPasswordLink onForgotPassword={onForgotPassword} />
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full py-3"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : 'Sign In'}
        </Button>
      </div>
    </form>
  );
};
