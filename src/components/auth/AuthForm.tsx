
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ActionButton } from '../ui/ActionButton';
import { useToast } from '@/hooks/use-toast';

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
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      } else {
        await signUp(email, password, name);
        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sketch-bg">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-serif font-medium mb-6 text-jess-secondary">I made this program because I had to do all this for myself.</h1>
        <p className="text-jess-muted max-w-xl mx-auto mb-8">
          I made this program because I lost myself, and I had to find my way back alone.
        </p>
      </div>
      
      <div className="card-base animate-fade-in border-2 border-black/10">
        <h2 className="text-2xl font-serif font-medium mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-jess-muted mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-base border-2 border-black/10"
                placeholder="Your name"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-jess-muted mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base border-2 border-black/10"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-jess-muted mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base border-2 border-black/10"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full py-3 px-4 bg-jess-primary text-white rounded-full font-medium hover:bg-jess-primary/90 transition-all"
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : isLogin
                  ? 'Sign In'
                  : 'Create Account'
              }
            </button>
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
