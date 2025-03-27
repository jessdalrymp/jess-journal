
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { ErrorMessage } from './ErrorMessage';

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

type SignupFormData = z.infer<typeof signupSchema>;

interface SignUpFormProps {
  onVerificationSent: (email: string) => void;
}

export const SignUpForm = ({ onVerificationSent }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

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

      {error && <ErrorMessage error={error} />}

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
  );
};
