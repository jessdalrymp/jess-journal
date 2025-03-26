
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { checkUserExists } from './utils/userVerification';
import { createUserRecord } from './utils/userRecordManagement';
import { sendVerificationEmail } from './utils/emailVerification';

/**
 * Result of sign up operation
 */
export interface SignUpResult {
  user?: any;
  session?: any;
  exists?: boolean;
  emailVerificationRequired?: boolean;
  emailSent?: boolean;
}

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Sign up a new user with email and password
   */
  const signUp = async (
    email: string, 
    password: string, 
    name?: string, 
    checkExists = false
  ): Promise<SignUpResult> => {
    setLoading(true);
    console.log("Starting sign up process for:", email);
    
    try {
      // Optionally check if user exists first
      if (checkExists) {
        const exists = await checkUserExists(email);
        if (exists) {
          console.log("User already exists:", email);
          toast({
            title: "User exists",
            description: "An account with this email already exists. Try signing in instead.",
          });
          return { exists: true };
        }
      }
      
      console.log("Signing up with:", email, name);
      
      // Get the current origin (domain) to use for redirection
      const origin = window.location.origin;
      console.log("Current origin for redirects:", origin);
      
      // Check if we're running in a development environment
      const isDevelopment = origin.includes('localhost') || origin.includes('127.0.0.1');
      console.log("Is development environment:", isDevelopment);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            isNewUser: true // Add flag to identify new users
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Sign-up response:", data);
      
      return handleSignUpResponse(data, email, name, origin, isDevelopment);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Add specific handling for email sending errors
      if (error.message && error.message.includes("sending email")) {
        console.error("Email sending error detected, might be an SMTP configuration issue");
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle the response from the sign up attempt
   */
  const handleSignUpResponse = async (
    data: any, 
    email: string, 
    name?: string,
    origin?: string,
    isDevelopment?: boolean
  ): Promise<SignUpResult> => {
    // If we have a session, it means email confirmation is disabled
    if (data?.session) {
      console.log("Sign-up successful with session:", data.user?.id);
      
      // Insert the new user into the profiles table
      if (data.user) {
        await createUserRecord(data.user.id, email, name);
      }
      
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      return { ...data, emailVerificationRequired: false, emailSent: true };
    } 
    // If we only have a user but no session, email confirmation is required
    else if (data?.user) {
      console.log("Sign-up requires email verification:", data.user.id);
      let emailSent = false;
      
      // Check email verification status
      if (data.user.identities && 
          data.user.identities.length > 0 && 
          data.user.identities[0].identity_data) {
          
        const emailVerified = data.user.identities[0].identity_data.email_verified;
        
        if (emailVerified === false && origin) {
          console.log("Email verification required, email should be sent");
          
          // Try to send a manual verification email as a backup
          emailSent = await sendVerificationEmail(origin, email);
          
          toast({
            title: "Almost there!",
            description: "Please check your email to verify your account. If you don't see it, check your spam folder.",
            duration: 6000,
          });
        } else {
          console.log("Email already verified, but session not created");
          toast({
            title: "Account created",
            description: "Your email is verified, but we couldn't log you in automatically. Please try logging in manually.",
            duration: 6000,
          });
        }
      } else {
        // For development environments or when email verification is disabled
        if (isDevelopment) {
          console.log("Development environment detected - email verification might be disabled in Supabase dashboard");
          toast({
            title: "Development notice",
            description: "For local testing, consider disabling email verification in the Supabase dashboard",
            duration: 6000,
          });
        }
        
        toast({
          title: "Account created!",
          description: "Your account has been created. Please check your email for verification instructions.",
          duration: 6000,
        });
      }
      return { user: data.user, emailVerificationRequired: true, emailSent };
    } else {
      console.error("No user or session returned after sign up");
      throw new Error("Account creation failed. Please try again.");
    }
  };

  return { signUp, checkUserExists, createUserRecord, loading };
};
