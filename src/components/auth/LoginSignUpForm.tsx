
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { ForgotPasswordLink } from './ForgotPasswordLink';
import { ErrorMessage } from './ErrorMessage';

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Validation schema for signup
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

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
  const { signIn, signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Signup form
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmitLogin = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    try {
      await signIn(data.email, data.password);
      // No need to navigate, the AuthContext will handle that
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitSignup = async (data: SignupFormData) => {
    setError(null);
    setLoading(true);

    try {
      await signUp(data.email, data.password, data.name);
      onVerificationSent(data.email);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err?.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-medium mb-6 text-center">
        {isLogin ? 'Welcome Back' : 'Create Your Account'}
      </h2>
      
      {isLogin ? (
        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
          <div>
            <Input
              {...loginForm.register('email')}
              type="email"
              placeholder="Email"
              disabled={loading}
            />
            {loginForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Input
              {...loginForm.register('password')}
              type="password"
              placeholder="Password"
              disabled={loading}
            />
            {loginForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          {error && <ErrorMessage message={error} />}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="text-center">
            <ForgotPasswordLink onClick={onForgotPassword} />
          </div>
        </form>
      ) : (
        <form onSubmit={signupForm.handleSubmit(onSubmitSignup)} className="space-y-4">
          <div>
            <Input
              {...signupForm.register('name')}
              placeholder="Full Name"
              disabled={loading}
            />
            {signupForm.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              {...signupForm.register('email')}
              type="email"
              placeholder="Email"
              disabled={loading}
            />
            {signupForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Input
              {...signupForm.register('password')}
              type="password"
              placeholder="Password"
              disabled={loading}
            />
            {signupForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.password.message}</p>
            )}
          </div>

          <div>
            <Input
              {...signupForm.register('confirmPassword')}
              type="password"
              placeholder="Confirm Password"
              disabled={loading}
            />
            {signupForm.formState.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          {error && <ErrorMessage message={error} />}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      )}

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-jess-primary hover:underline text-sm"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </>
  );
};
