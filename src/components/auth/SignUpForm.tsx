
import { useState } from 'react';
import { AuthFormInput } from './AuthFormInput';
import { ErrorMessage } from './ErrorMessage';
import { useSignUpValidation } from '../../hooks/auth/useSignUpValidation';
import { useSignUpSubmit } from '../../hooks/auth/useSignUpSubmit';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SignUpFormProps {
  onVerificationSent: (email: string) => void;
}

export const SignUpForm = ({ onVerificationSent }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  const { error, setError, validateForm } = useSignUpValidation();
  const { handleSubmit, isProcessing, loading } = useSignUpSubmit({ onVerificationSent });
  
  const isLoading = loading || isProcessing;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission triggered');
    
    // Validate form before submitting
    if (validateForm(email, password, confirmPassword, name)) {
      console.log('Form validation passed, submitting...');
      handleSubmit(e, email, password, name, () => true, setError);
    } else {
      console.log('Form validation failed');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthFormInput
        id="name"
        type="text"
        value={name}
        onChange={setName}
        label="Name"
        placeholder="Your name"
        disabled={isLoading}
      />
      
      <AuthFormInput
        id="email"
        type="email"
        value={email}
        onChange={setEmail}
        label="Email"
        placeholder="you@example.com"
        disabled={isLoading}
      />
      
      <AuthFormInput
        id="password"
        type="password"
        value={password}
        onChange={setPassword}
        label="Password"
        placeholder="••••••••"
        disabled={isLoading}
      />
      
      <AuthFormInput
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        label="Confirm Password"
        placeholder="••••••••"
        disabled={isLoading}
      />
      
      <ErrorMessage error={error} />
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full py-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : 'Create Account'}
        </Button>
      </div>
    </form>
  );
};
