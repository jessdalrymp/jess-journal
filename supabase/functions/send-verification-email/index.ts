
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Get API key from environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Log the API key status (not the actual key)
console.log(`Resend API key ${RESEND_API_KEY ? "is set" : "is NOT set"}`);
console.log(`API key first few characters: ${RESEND_API_KEY ? RESEND_API_KEY.substring(0, 3) + "..." : "none"}`);

// Initialize Resend with the API key
const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  verificationUrl: string;
  useTextOnly?: boolean;
  retryCount?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  console.log("Received verification email request", new Date().toISOString());
  console.log("Request headers:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
  
  try {
    // Validate API key before proceeding
    if (!RESEND_API_KEY) {
      console.error("CRITICAL ERROR: RESEND_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email service configuration error", 
          details: "Missing API key in configuration"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Parse request body
    let requestData: VerificationRequest;
    try {
      const rawBody = await req.text();
      console.log("Raw request body:", rawBody.substring(0, 200) + (rawBody.length > 200 ? "..." : ""));
      requestData = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid request format", 
          details: "Could not parse JSON body"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { email, verificationUrl, useTextOnly = false, retryCount = 0 } = requestData;
    
    console.log(`Received request to send verification email to: ${email} (retry: ${retryCount}, text-only: ${useTextOnly})`);
    console.log(`Verification URL: ${verificationUrl}`);
    
    if (!email || !verificationUrl) {
      console.error("Missing required parameters: email or verificationUrl");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required parameters: email or verificationUrl" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid email format" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // URL validation - ensure it has expected format
    try {
      new URL(verificationUrl);
    } catch (urlError) {
      console.error("Invalid verification URL:", verificationUrl);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid verification URL format" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Prepare and send the email
    console.log(`Attempting to send verification email to ${email} at ${new Date().toISOString()} (text-only: ${useTextOnly})`);
    let emailResponse;
    
    try {
      if (useTextOnly) {
        // Send text-only email as fallback
        console.log("Sending text-only email as fallback...");
        emailResponse = await resend.emails.send({
          from: "Jess Journal <onboarding@resend.dev>",
          to: [email],
          subject: "Verify your email - Jess Journal",
          text: `
Welcome to Jess Journal!

Thank you for signing up. Please verify your email address by visiting this link:
${verificationUrl}

This link will expire in 24 hours.

Best regards,
The Jess Journal Team
          `,
        });
      } else {
        // Send HTML email (primary attempt)
        emailResponse = await resend.emails.send({
          from: "Jess Journal <onboarding@resend.dev>",
          to: [email],
          subject: "Verify your email - Jess Journal",
          html: `
            <h2>Welcome to Jess Journal!</h2>
            <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
            <p><a href="${verificationUrl}" style="display: inline-block; background-color: #8247e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
            <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
            <p>${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br>The Jess Journal Team</p>
          `,
        });
      }
    } catch (emailError: any) {
      console.error("Exception when calling Resend API:", emailError);
      console.error("Error details:", emailError.stack || "No stack trace available");
      
      // If this was the HTML attempt, try with plain text instead
      if (!useTextOnly) {
        try {
          console.log("First attempt failed, trying with text-only email...");
          emailResponse = await resend.emails.send({
            from: "Jess Journal <onboarding@resend.dev>",
            to: [email],
            subject: "Verify your email - Jess Journal",
            text: `
Welcome to Jess Journal!

Thank you for signing up. Please verify your email address by visiting this link:
${verificationUrl}

This link will expire in 24 hours.

Best regards,
The Jess Journal Team
            `,
          });
          
          if (emailResponse.error) {
            throw new Error(emailResponse.error.message || "Unknown error with simplified email");
          }
          
          console.log("Text-only email sent successfully as fallback!");
        } catch (retryError: any) {
          console.error("Both HTML and text-only attempts failed:", retryError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Email sending failed after multiple attempts", 
              details: retryError.message || emailError.message || "Unknown error occurred while sending email"
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      } else {
        // This was already the text-only attempt and it failed
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Email sending failed", 
            details: emailError.message || "Unknown error occurred while sending email"
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }
    
    console.log("Verification email API response:", JSON.stringify(emailResponse, null, 2));
    
    // Check if there was an error in the response
    if (emailResponse && emailResponse.error) {
      console.error("Error from Resend API:", emailResponse.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: emailResponse.error.message || "Unknown API error",
          details: "Failed to send verification email through Resend API" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: emailResponse,
        message: "Verification email sent successfully",
        textOnly: useTextOnly 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    // Log the full error details
    console.error("Error in send-verification-email function:", error);
    console.error("Error stack:", error.stack || "No stack trace available");
    console.error("Error message:", error.message || "No error message available");
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error",
        details: "Exception caught in send-verification-email function" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
