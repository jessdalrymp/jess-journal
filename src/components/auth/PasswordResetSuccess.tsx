
import React from 'react';
import { Mail } from 'lucide-react';
import { ActionButton } from '../ui/ActionButton';

interface PasswordResetSuccessProps {
  email?: string;
  onClose: () => void;
}

export const PasswordResetSuccess = ({ email, onClose }: PasswordResetSuccessProps) => {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <Mail className="h-6 w-6 text-green-600" />
      </div>
      
      {email && (
        <p className="text-sm text-jess-muted mb-4">
          We've sent instructions to <strong>{email}</strong>. 
          Check your inbox (and spam folder) to reset your password.
        </p>
      )}
      
      <ActionButton 
        type="secondary" 
        className="mt-4"
        onClick={onClose}
      >
        Close
      </ActionButton>
    </div>
  );
};
