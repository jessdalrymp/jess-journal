
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
      if (isLogin) {
        // Login flow
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      } else {
        // Registration flow
        if (!name.trim()) {
          toast({
            title: "Name required",
            description: "Please enter your name to create an account.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        await signUp(email, password, name);
        toast({
          title: "Account created!",
          description: "Your account has been successfully created. Please check your email for verification if required.",
        });
        
        // Automatically switch to login view after successful registration
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: error.message || "Please check your credentials and try again.",
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
