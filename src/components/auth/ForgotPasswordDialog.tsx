
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateEmail } from '../../utils/authValidation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { ActionButton } from '../ui/ActionButton';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordDialog = ({ isOpen, onClose }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error: any) {
      let errorMessage = "Failed to send reset email. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-jess-subtle text-jess-foreground"
                placeholder="you@example.com"
                required
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-jess-muted" />
            </div>
            
            <DialogFooter className="pt-2">
              <ActionButton 
                type="primary" 
                className="w-full py-3"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </ActionButton>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <ActionButton 
              type="secondary" 
              className="mt-4"
              onClick={handleClose}
            >
              Close
            </ActionButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
