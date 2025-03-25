
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProfileCreationResult, SignUpResult } from './types';
import { createUserProfile, checkUserProfileExists } from './signupUtils';

export const useSignUpCore = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signUp = async (
    email: string, 
    password: string, 
    name?: string, 
    checkExists = false
  ): Promise<SignUpResult> => {
    setLoading(true);
    try {
      console.log('=== Starting signup process ===');
      
      // Optionally check if user exists first
      if (checkExists) {
        const exists = await checkUserProfileExists(email);
        if (exists) {
          console.log('User already exists, aborting signup');
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
      
      // Let Supabase handle the signup process including password hashing
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            isNewUser: true
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        throw error;
      }

      console.log("Sign-up response:", JSON.stringify(data, null, 2));
      
      // If we have a session, it means email confirmation is disabled
      if (data?.session) {
        console.log("Sign-up successful with session:", data.user?.id);
        
        // Insert the new user into the profiles table
        if (data.user) {
          try {
            const profileResult = await createUserProfile(data.user.id, email, name);
            console.log("Profile creation result:", profileResult);
          } catch (profileError) {
            console.error("Failed to create user profile:", profileError);
            // Continue anyway since the auth user was created
          }
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
          
          if (emailVerified === false) {
            console.log("Email verification required, email should be sent");
            
            // Try to send a manual verification email as a backup
            try {
              const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: email,
                options: {
                  emailRedirectTo: `${origin}/auth/callback`,
                }
              });
              
              if (resendError) {
                console.error("Error resending verification email:", resendError);
                console.error("Error details:", JSON.stringify(resendError, null, 2));
              } else {
                console.log("Manual verification email sent successfully");
                emailSent = true;
              }
            } catch (resendError) {
              console.error("Exception resending verification email:", resendError);
            }
            
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
            
            // Try to create a profile record manually for development environments
            if (data.user) {
              try {
                const profileResult = await createUserProfile(data.user.id, email, name);
                console.log("Profile manually created in development environment:", profileResult.success);
              } catch (profileError) {
                console.error("Failed to manually create profile in development:", profileError);
                console.error("Error details:", JSON.stringify(profileError, null, 2));
              }
            }
            
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
        console.log('=== Completed signup process ===');
        return { user: data.user, emailVerificationRequired: true, emailSent };
      } else {
        console.error("No user or session returned after sign up");
        throw new Error("Account creation failed. Please try again.");
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error stack:', error.stack);
      
      // Add specific handling for email sending errors
      if (error.message && error.message.includes("sending email")) {
        console.error("Email sending error detected, might be an SMTP configuration issue");
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading };
};
