import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthFormInput } from './AuthFormInput';
import { ActionButton } from '../ui/ActionButton';
import { ErrorMessage } from './ErrorMessage';
import { RateLimitError } from './RateLimitError';
import { validateEmail, validatePassword, validateName } from '../../utils/authValidation';
import { useSignUpSubmit } from '../../hooks/auth/useSignUpSubmit';
import { getRateLimitMessage } from '../../utils/email/rateLimitDetection';

interface SignUpFormProps {
  onVerificationSent: (email: string) => void;
}

export const SignUpForm = ({ onVerificationSent }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRateLimitError, setIsRateLimitError] = useState(false);
  
  const { handleSubmit, isProcessing, loading, attemptCount } = useSignUpSubmit({ onVerificationSent });
  const { toast } = useToast();

  const validateForm = (): boolean => {
    setError(null);
    
    if (!email || !password || !name) {
      setError("Please fill in all required fields.");
      return false;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (!validateName(name)) {
      setError("Please enter a valid name (at least 2 characters).");
      return false;
    }

    return true;
  };

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, email, password, name, validateForm, setError, setIsRateLimitError);
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
        disabled={isRateLimitError}
      />
      
      <AuthFormInput
        id="email"
        type="email"
        value={email}
        onChange={setEmail}
        label="Email"
        placeholder="you@example.com"
        disabled={isRateLimitError}
      />
      
      <AuthFormInput
        id="password"
        type="password"
        value={password}
        onChange={setPassword}
        label="Password"
        placeholder="••••••••"
        disabled={isRateLimitError}
      />
      
      {isRateLimitError ? (
        <RateLimitError 
          message={getRateLimitMessage('signup')}
          attempts={attemptCount}
        />
      ) : (
        <ErrorMessage error={error} />
      )}
      
      <div className="pt-2">
        <ActionButton 
          type="primary" 
          className="w-full py-3"
          disabled={isProcessing || loading || isRateLimitError}
        >
          {isProcessing || loading ? 'Processing...' : 'Create Account'}
        </ActionButton>
      </div>
    </form>
  );
};
