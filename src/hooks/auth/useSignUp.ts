
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
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
          emailRedirectTo: `${origin}/auth/callback`
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
        
        // Insert the new user into the public.users table
        if (data.user) {
          try {
            const { error: insertError } = await supabase.from('users').upsert({
              id: data.user.id,
              email: email,
              created_at: new Date().toISOString(),
              assessment_completed: false
            });
            
            if (insertError) {
              console.error("Error inserting user data:", insertError);
            }
          } catch (insertErr) {
            console.error("Exception inserting user data:", insertErr);
          }
        }
        
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
        return data;
      } 
      // If we only have a user but no session, email confirmation is required
      else if (data?.user) {
        console.log("Sign-up requires email verification:", data.user.id);
        
        // Check email verification status
        if (data.user.identities && 
            data.user.identities.length > 0 && 
            data.user.identities[0].identity_data) {
            
          const emailVerified = data.user.identities[0].identity_data.email_verified;
          
          if (emailVerified === false) {
            console.log("Email verification required, email should be sent");
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
        return data;
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

  return { signUp, loading };
};
