
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ActionButton } from '../ui/ActionButton';
import { AuthFormInput } from './AuthFormInput';
import { AuthFormHeader } from './AuthFormHeader';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';
import { validateEmail, validatePassword, validateName } from '../../utils/authValidation';
import { LegalLinks } from '../common/LegalLinks';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (!isLogin && !validateName(name)) {
      toast({
        title: "Name required",
        description: "Please enter your name to create an account.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
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
        
        // If no session was created, it likely means verification is required
        if (result?.user && !result?.session) {
          setVerificationSent(true);
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
          setVerificationSent(true);
        } else if (error.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Try signing in instead.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Render a special message when verification email has been sent
  if (verificationSent && !isLogin) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <AuthFormHeader />
        
        <div className="card-base animate-fade-in">
          <div className="text-center p-6">
            <div className="mb-6 mx-auto w-16 h-16 bg-jess-subtle/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-jess-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium mb-3">Check Your Email</h2>
            <p className="text-jess-muted mb-6">
              We've sent a verification link to <strong>{email}</strong>. 
              Please check your inbox (and spam folder) to verify your account.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-jess-muted">
                Didn't receive the email? Check your spam folder or try again in a few minutes.
              </p>
              <button
                onClick={() => {
                  setVerificationSent(false);
                  setIsLogin(true);
                }}
                className="text-jess-primary hover:underline text-sm transition-colors"
              >
                Return to sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <AuthFormHeader />
      
      <div className="card-base animate-fade-in">
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
          
          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
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
            onClick={() => setIsLogin(!isLogin)}
            className="text-jess-primary hover:underline text-sm transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
      
      <div className="mt-8 space-y-3">
        <p className="text-center text-sm text-jess-muted">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
        
        <LegalLinks className="mt-1" />
      </div>
      
      <ForgotPasswordDialog 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
};
