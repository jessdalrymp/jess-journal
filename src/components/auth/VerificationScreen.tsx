
import { useState } from 'react';
import { sendVerificationEmail } from '../../hooks/auth/utils/emailVerification';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Mail } from 'lucide-react';

interface VerificationScreenProps {
  email: string;
  onBackToSignIn: () => void;
}

export const VerificationScreen = ({ email, onBackToSignIn }: VerificationScreenProps) => {
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResendVerification = async () => {
    setResending(true);
    setResendError(null);
    setResendSuccess(false);
    
    try {
      // Get current origin for the redirect URL
      const origin = window.location.origin;
      
      const success = await sendVerificationEmail(origin, email);
      if (success) {
        setResendSuccess(true);
      } else {
        setResendError("Failed to resend verification email. Please try again.");
      }
    } catch (error: any) {
      console.error("Error resending verification:", error);
      setResendError(error.message || "An unexpected error occurred.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-jess-background p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-jess-subtle/30 animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="bg-jess-subtle/30 p-4 rounded-full">
            <Mail className="h-12 w-12 text-jess-primary" />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-medium text-jess-foreground mb-2">Check Your Email</h1>
          <p className="text-jess-muted text-sm sm:text-base">
            We've sent a verification link to <strong>{email}</strong>.
            <br />Please check your inbox and click the link to verify your account.
          </p>
        </div>
        
        {resendSuccess && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center mb-4">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>Verification email resent successfully!</span>
          </div>
        )}
        
        {resendError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {resendError}
          </div>
        )}
        
        <div className="space-y-3">
          <Button 
            onClick={handleResendVerification}
            className="w-full"
            disabled={resending}
          >
            {resending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Resending...
              </span>
            ) : (
              'Resend Verification Email'
            )}
          </Button>
          
          <Button 
            onClick={onBackToSignIn}
            variant="outline"
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
        
        <div className="mt-6 text-center text-sm text-jess-muted">
          <p>
            If you don't see the email, check your spam folder or try signing in again.
          </p>
        </div>
      </div>
    </div>
  );
};
