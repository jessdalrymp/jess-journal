
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AuthFormInput } from './AuthFormInput';
import { ActionButton } from '../ui/ActionButton';
import { ErrorMessage } from './ErrorMessage';
import { validateEmail, validatePassword, validateName } from '../../utils/authValidation';

interface SignUpFormProps {
  onVerificationSent: (email: string) => void;
}

export const SignUpForm = ({ onVerificationSent }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp } = useAuth();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    setError(null);
    
    if (!email || !password || !name) {
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

    if (!validateName(name)) {
      setError("Please enter your name to create an account.");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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

      console.log("Attempting to sign up with:", { email, name });
      const result = await signUp(email, password, name);
      
      // If no session was created, assume verification is required
      if (result?.user && !result?.session) {
        console.log("Email verification likely required, redirecting to verification screen");
        onVerificationSent(email);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message) {
        if (error.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Try signing in instead.";
        } else if (error.message.includes("rate limit") || error.message.includes("429")) {
          errorMessage = "Too many attempts. Please try again after a few minutes.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthFormInput
        id="name"
        type="text"
        value={name}
        onChange={setName}
        label="Name"
        placeholder="Your name"
      />
      
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
      
      <AuthFormInput
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        label="Confirm Password"
        placeholder="••••••••"
      />
      
      <ErrorMessage error={error} />
      
      <div className="pt-2">
        <ActionButton 
          type="primary" 
          className="w-full py-3"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Create Account'}
        </ActionButton>
      </div>
    </form>
  );
};
