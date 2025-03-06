import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ActionButton } from '../ui/ActionButton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!email || !password) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Validate password length
      if (password.length < 6) {
        toast({
          title: "Password too short",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (isLogin) {
        console.log("Attempting to sign in with:", { email });
        try {
          const result = await signIn(email, password);
          console.log("Sign in successful in form component:", result);
        } catch (error: any) {
          console.error("Sign in failed in form component:", error);
          throw error;
        }
      } else {
        if (!name.trim()) {
          toast({
            title: "Name required",
            description: "Please enter your name to create an account.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        console.log("Attempting to sign up with:", { email, name });
        try {
          const result = await signUp(email, password, name);
          console.log("Sign up successful in form component:", result);
        } catch (error: any) {
          console.error("Sign up failed in form component:", error);
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Handle specific error messages from Supabase
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email to confirm your account before signing in.";
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

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2 text-jess-primary">JESS</h1>
        <p className="text-lg text-jess-muted">Your AI Storytelling Coach</p>
      </div>
      
      <div className="card-base animate-fade-in">
        <h2 className="text-2xl font-medium mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-jess-muted mb-1">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-jess-subtle text-jess-foreground"
                placeholder="Your name"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-jess-muted mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-jess-subtle text-jess-foreground"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-jess-muted mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-jess-subtle text-jess-foreground"
              placeholder="••••••••"
              required
            />
          </div>
          
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
      
      <p className="mt-8 text-center text-sm text-jess-muted">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};
