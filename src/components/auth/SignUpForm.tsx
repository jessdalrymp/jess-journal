
import { useState } from 'react';
import { AuthFormInput } from './AuthFormInput';
import { ActionButton } from '../ui/ActionButton';
import { ErrorMessage } from './ErrorMessage';
import { useSignUpValidation } from '../../hooks/auth/useSignUpValidation';
import { useSignUpSubmit } from '../../hooks/auth/useSignUpSubmit';

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

  const validateAndSubmit = (e: React.FormEvent) => {
    const isValid = validateForm(email, password, confirmPassword, name);
    handleSubmit(e, email, password, name, () => isValid, setError);
  };

  return (
    <form onSubmit={validateAndSubmit} className="space-y-4">
      <AuthFormInput
        id="name"
        type="text"
        value={name}
        onChange={setName}
        label="Name"
        placeholder="Your name"
      />
      
      <AuthFormInput
        id="email"
        type="email"
        value={email}
        onChange={setEmail}
        label="Email"
        placeholder="you@example.com"
      />
      
      <AuthFormInput
        id="password"
        type="password"
        value={password}
        onChange={setPassword}
        label="Password"
        placeholder="••••••••"
      />
      
      <AuthFormInput
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        label="Confirm Password"
        placeholder="••••••••"
      />
      
      <ErrorMessage error={error} />
      
      <div className="pt-2">
        <ActionButton 
          type="primary" 
          className="w-full py-3"
          disabled={loading || isProcessing}
        >
          {loading || isProcessing ? 'Processing...' : 'Create Account'}
        </ActionButton>
      </div>
    </form>
  );
};
