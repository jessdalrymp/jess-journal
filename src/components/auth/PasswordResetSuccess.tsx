
import React from 'react';
import { Mail, AlertTriangle } from 'lucide-react';
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
        <>
          <p className="text-sm text-jess-muted mb-2">
            We've sent instructions to <strong>{email}</strong>.
          </p>
          <div className="mb-4 p-3 bg-amber-50 rounded-md flex items-start gap-2 text-left">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              <strong>Important:</strong> Please check both your inbox and spam/junk folder, as authentication emails often get filtered.
            </p>
          </div>
        </>
      )}
      
      <ActionButton 
        type="secondary" 
        className="mt-2"
        onClick={onClose}
      >
        Close
      </ActionButton>
    </div>
  );
};
