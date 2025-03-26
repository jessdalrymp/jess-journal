
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordDialog = ({ isOpen, onClose }: ForgotPasswordDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl font-medium">Reset Your Password</DialogTitle>
          <p className="text-center text-jess-muted text-sm sm:text-base mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </DialogHeader>
        
        <div className="mt-4">
          <ForgotPasswordForm onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
