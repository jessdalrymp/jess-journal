
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ActionButton } from '../ui/ActionButton';
import { AuthFormInput } from './AuthFormInput';
import { validateEmail, validatePassword, validateName } from '../../utils/authValidation';
import { AlertCircle } from 'lucide-react';

interface LoginSignUpFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onForgotPassword: () => void;
  onVerificationSent: (email: string) => void;
}

export const LoginSignUpForm = ({ 
  isLogin, 
  onToggleMode, 
  onForgotPassword,
  onVerificationSent
}: LoginSignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();
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

    if (!isLogin) {
      if (!validateName(name)) {
        setError("Please enter your name to create an account.");
        return false;
      }
      
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
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

      if (isLogin) {
        console.log("Attempting to sign in with:", { email });
        await signIn(email, password);
        console.log("Sign in successful");
      } else {
        console.log("Attempting to sign up with:", { email, name });
        const result = await signUp(email, password, name);
        
        // If no session was created, assume verification is required
        if (result?.user && !result?.session) {
          console.log("Email verification likely required, redirecting to verification screen");
          onVerificationSent(email);
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email to confirm your account before signing in.";
          onVerificationSent(email);
        } else if (error.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Try signing in instead.";
        } else if (error.message.includes("rate limit") || error.message.includes("429")) {
          errorMessage = "Too many attempts. Please try again after a few minutes.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-medium mb-6 text-center">
        {isLogin ? 'Welcome Back' : 'Create Your Account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <AuthFormInput
            id="name"
            type="text"
            value={name}
            onChange={setName}
            label="Name"
            placeholder="Your name"
          />
        )}
        
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
        
        {!isLogin && (
          <AuthFormInput
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            label="Confirm Password"
            placeholder="••••••••"
          />
        )}
        
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}
        
        {isLogin && (
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-jess-primary hover:underline text-sm transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}
        
        <div className="pt-2">
          <ActionButton 
            type="primary" 
            className="w-full py-3"
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : isLogin
                ? 'Sign In'
                : 'Create Account'
            }
          </ActionButton>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <button
          onClick={onToggleMode}
          className="text-jess-primary hover:underline text-sm transition-colors"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"
          }
        </button>
      </div>
    </>
  );
};
