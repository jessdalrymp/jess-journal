
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSignUp } from './useSignUp';
import { 
  sendCustomVerificationEmail, 
  EmailVerificationResult 
} from '../../utils/email';
import { isRateLimited } from '../../utils/email/rateLimitDetection';

interface UseSignUpSubmitProps {
  onVerificationSent: (email: string) => void;
}

export const useSignUpSubmit = ({ onVerificationSent }: UseSignUpSubmitProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { signUp, loading } = useSignUp();
  const { toast } = useToast();

  const handleSubmit = async (
    e: React.FormEvent,
    email: string,
    password: string, 
    name: string,
    validateForm: () => boolean,
    setError: (error: string | null) => void
  ) => {
    e.preventDefault();
    setError(null);
    
    try {
      console.log("Starting sign up submission");
      if (!validateForm()) {
        console.log("Validation failed in handleSubmit");
        return;
      }

      setIsProcessing(true);
      console.log("Attempting to sign up with:", { email, name });
      
      // Check if email and password are valid
      if (!email || !password) {
        setError("Email and password are required");
        setIsProcessing(false);
        return;
      }
      
      const result = await signUp(email, password, name, true); // Added true to check if user exists
      console.log("Sign up result:", result);
      
      // Check if user exists
      if (result?.exists) {
        console.log("User already exists");
        setError("An account with this email already exists. Try signing in instead.");
        setIsProcessing(false);
        return;
      }
      
      // If no session was created, assume verification is required
      if (result?.user && result.emailVerificationRequired) {
        console.log("Email verification required, sending verification email");
        
        // Send verification email using our custom sender
        const emailResult: EmailVerificationResult = await sendCustomVerificationEmail(email);
        console.log("Email verification result:", emailResult);
        
        if (emailResult.success) {
          console.log("Verification email sent successfully");
          toast({
            title: "Account created",
            description: "Please check your email to verify your account. If you don't see it, check your spam folder.",
            duration: 6000,
          });
          onVerificationSent(email);
        } else if (emailResult.rateLimit) {
          console.log("Rate limit detected when sending verification email");
          
          // More user-friendly message
          toast({
            title: "Account created",
            description: "Your account has been created. Please check your email for the verification link or try signing in after a few minutes.",
            duration: 8000,
          });
          
          // Still redirect to verification screen
          onVerificationSent(email);
        } else {
          console.log("Failed to send verification email");
          toast({
            title: "Account created",
            description: "We had trouble sending the verification email. Please try signing in after a few minutes to resend the verification link.",
            duration: 8000,
          });
          onVerificationSent(email);
        }
      } else if (result?.user && result.session) {
        // User was created and logged in immediately (email verification disabled)
        console.log("User created and logged in immediately");
        toast({
          title: "Account created successfully",
          description: "You have been logged in automatically.",
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      // Use the improved rate limit detection
      const rateLimited = isRateLimited(error.message);
      
      if (error.message) {
        if (error.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Try signing in instead.";
        } else if (rateLimited) {
          errorMessage = "Please wait a moment before creating another account.";
          
          // Don't show toasts for rate limits - use a more friendly approach
          toast({
            title: "Please wait a moment",
            description: "For security reasons, please wait a few minutes before trying again.",
            duration: 8000,
          });
        } else if (error.message.includes("sending email") || error.message.includes("smtp")) {
          errorMessage = "We're having trouble with our email service. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      // Only show toast for non-rate limit errors to avoid double notifications
      if (!rateLimited) {
        toast({
          title: "Registration issue",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleSubmit,
    isProcessing,
    loading
  };
};
