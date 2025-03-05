
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
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold mb-2 text-jess-primary font-serif">JESS</h1>
        <p className="text-lg text-jess-muted">Your AI Storytelling Coach</p>
        <p className="text-xl font-serif text-jess-primary/80 italic mt-2">
          Rewrite your story, one conversation at a time.
        </p>
      </div>
      
      <div className="card-base animate-fade-in sketch-border bg-white/90">
        <h2 className="text-2xl font-medium mb-6 text-center font-serif">
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
                className="input-base"
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
              className="input-base"
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
              className="input-base"
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
      
      <div className="mt-8 p-6 bg-jess-subtle/50 rounded-xl text-center border border-jess-subtle">
        <p className="text-jess-muted text-sm leading-relaxed">
          JESS helps you process your stories, reframe limiting beliefs, and take actionable steps toward real change — just like chatting with a wise, warm friend who guides you toward deeper awareness.
        </p>
      </div>
    </div>
  );
};
