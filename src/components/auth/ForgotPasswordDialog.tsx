
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { PasswordResetSuccess } from './PasswordResetSuccess';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordDialog = ({ isOpen, onClose }: ForgotPasswordDialogProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setEmail('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isSubmitted ? "Email Sent" : "Reset Password"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSubmitted 
              ? "Check your inbox for instructions to reset your password."
              : "Enter your email address and we'll send you a link to reset your password."}
          </DialogDescription>
        </DialogHeader>
        
        {!isSubmitted ? (
          <ForgotPasswordForm onSuccess={handleSuccess} />
        ) : (
          <PasswordResetSuccess email={email} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};
