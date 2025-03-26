
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      console.log("Checking if user exists:", email);
      
      // First try profiles lookup as it's more reliable
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking if user exists in profiles:", error);
      }
      
      if (data) {
        console.log("User exists in profiles:", data.id);
        return true;
      }

      // Try auth lookup as fallback using a different approach
      // The admin.listUsers with filters is not supported in the current version
      try {
        const { data: authData, error: signInError } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: false // Only check if user exists, don't create
          }
        });
        
        // If there's no error with code 'user_not_found', the user likely exists
        if (!signInError || !signInError.message.includes('user_not_found')) {
          console.log("User likely exists in auth system");
          return true;
        }
      } catch (e) {
        console.log("Error checking auth system:", e);
        // Ignore errors here, we're just doing a check
      }

      console.log("User does not appear to exist");
      return false;
    } catch (error) {
      console.error("Exception checking if user exists:", error);
      return false;
    }
  };

  const createUserRecord = async (userId: string, email: string, name?: string) => {
    try {
      console.log("Creating user record for:", userId, email, name);
      const { error } = await supabase.from('profiles').upsert({
        id: userId,
        email: email,
        created_at: new Date().toISOString(),
        assessment_completed: false,
        // We can set name in user_metadata but not in profiles directly since there's no name column
      });
      
      if (error) {
        console.error("Error creating user record:", error);
        throw error;
      }
      
      console.log("User record created successfully");
      return true;
    } catch (error) {
      console.error("Exception creating user record:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name?: string, checkExists = false): Promise<{ user?: any; session?: any; exists?: boolean; emailVerificationRequired?: boolean; emailSent?: boolean }> => {
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

  return { signUp, checkUserExists, createUserRecord, loading };
};
