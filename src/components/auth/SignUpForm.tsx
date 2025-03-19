
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthFormInput } from './AuthFormInput';
import { ActionButton } from '../ui/ActionButton';
import { ErrorMessage } from './ErrorMessage';
import { validateEmail, validatePassword, validateName } from '../../utils/authValidation';
import { useSignUp } from '../../hooks/auth/useSignUp';

interface SignUpFormProps {
  onVerificationSent: (email: string) => void;
}

export const SignUpForm = ({ onVerificationSent }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { signUp, loading } = useSignUp();
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
      setError("Please enter your name to create an account.");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const sendCustomVerificationEmail = async (email: string) => {
    try {
      // Get the domain origin
      const origin = window.location.origin;
      
      // Construct the verification URL
      const verificationUrl = `${origin}/auth/callback?signUpEmail=${encodeURIComponent(email)}`;
      
      console.log("Sending verification email to:", email);
      console.log("Verification URL:", verificationUrl);
      
      // Use the correct Supabase project URL for the function
      const supabaseUrl = 'https://uobvlrobwohdlfbhniho.supabase.co';
      const functionUrl = `${supabaseUrl}/functions/v1/send-verification-email`;
      
      console.log("Calling verification email function at:", functionUrl);
      
      // Make the request with proper headers
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYnZscm9id29oZGxmYmhuaWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4Mzg4MjcsImV4cCI6MjA1NTQxNDgyN30.72SrWrfSrHhZ_hCcj5slTml4BABh-z_du8v9LGI8bsc`
        },
        body: JSON.stringify({
          email,
          verificationUrl
        })
      });
      
      // Parse the response
      const responseData = await response.json();
      console.log("Verification email API response:", responseData);
      
      if (!response.ok) {
        console.error('Failed to send verification email:', responseData);
        toast({
          title: "Verification email issue",
          description: "We had trouble sending the verification email. Please try again or contact support.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!responseData.success) {
        console.error('Error in verification email response:', responseData.error);
        toast({
          title: "Verification email error",
          description: responseData.error || "Error sending verification email. Please try again later.",
          variant: "destructive",
        });
        return false;
      }
      
      console.log("Verification email sent successfully via custom function");
      return true;
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      console.error('Error details:', error.stack);
      
      toast({
        title: "Verification email error",
        description: `Error sending verification email: ${error.message}. Please try again later.`,
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!validateForm()) {
        return;
      }

      console.log("Attempting to sign up with:", { email, name });
      const result = await signUp(email, password, name);
      
      // Check if user exists
      if (result?.exists) {
        console.log("User already exists");
        setError("An account with this email already exists. Try signing in instead.");
        return;
      }
      
      // If no session was created, assume verification is required
      if (result?.user && result.emailVerificationRequired) {
        console.log("Email verification required, sending verification email");
        
        // Try to manually send a verification email
        const emailSent = await sendCustomVerificationEmail(email);
        
        if (emailSent) {
          console.log("Custom verification email sent successfully");
          toast({
            title: "Account created",
            description: "Please check your email for verification instructions. If you don't see it, check your spam folder.",
            duration: 6000,
          });
          onVerificationSent(email);
        } else {
          console.log("Failed to send custom verification email");
          // Still redirect to verification screen, but with a warning
          toast({
            title: "Account created, but...",
            description: "We had trouble sending the verification email. Please check your spam folder or try logging in after a few minutes.",
            duration: 6000,
          });
          onVerificationSent(email);
        }
      } else if (result?.user && result.session) {
        // User was created and logged in immediately (email verification disabled)
        toast({
          title: "Account created successfully",
          description: "You have been logged in automatically.",
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message) {
        if (error.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Try signing in instead.";
        } else if (error.message.includes("rate limit") || error.message.includes("429")) {
          errorMessage = "Too many attempts. Please try again after a few minutes.";
        } else if (error.message.includes("sending email") || error.message.includes("smtp")) {
          errorMessage = "There was an issue sending the verification email. Your account has been created, but you may need to contact support to verify your email.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: "Registration issue",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Create Account'}
        </ActionButton>
      </div>
    </form>
  );
};
