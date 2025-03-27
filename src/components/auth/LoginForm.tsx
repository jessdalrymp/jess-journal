
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

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onForgotPassword: () => void;
}

export const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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

  return (
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

      {error && <ErrorMessage error={error} />}

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
        <ForgotPasswordLink onForgotPassword={onForgotPassword} />
      </div>
    </form>
  );
};
