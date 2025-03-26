
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ToggleAuthMode } from './ToggleAuthMode';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, signupSchema, LoginFormData, SignupFormData } from '@/utils/validationSchemas';

interface LoginSignUpFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onForgotPassword: () => void;
  onVerificationSent: (email: string) => void;
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
}

export const LoginSignUpForm = ({ 
  isLogin, 
  onToggleMode, 
  onForgotPassword,
  onVerificationSent,
  isLoading = false,
  setIsLoading = () => {}
}: LoginSignUpFormProps) => {
  const { signIn, signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema)
  });

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const loginData = data as LoginFormData;
        await signIn(loginData.email, loginData.password);
      } else {
        const signupData = data as SignupFormData;
        await signUp(signupData.email, signupData.password, signupData.name);
        onVerificationSent(signupData.email);
        reset(); // Clear the form after successful signup
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-medium mb-6 text-center">
        {isLogin ? 'Welcome Back' : 'Create Your Account'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Your name"
              disabled={isLoading}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full p-2 border rounded-md"
            placeholder="you@example.com"
            disabled={isLoading}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full p-2 border rounded-md"
            placeholder="••••••••"
            disabled={isLoading}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        {!isLogin && (
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full p-2 border rounded-md"
              placeholder="••••••••"
              disabled={isLoading}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}
        
        {isLogin && (
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-800"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>
      
      <ToggleAuthMode isLogin={isLogin} onToggleMode={onToggleMode} />
    </>
  );
};
