
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Get API key from environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Log the API key status (not the actual key)
console.log(`Resend API key ${RESEND_API_KEY ? "is set" : "is NOT set"}`);

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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const { email, verificationUrl }: VerificationRequest = await req.json();
    
    console.log(`Received request to send verification email to: ${email}`);
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
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email service configuration error: RESEND_API_KEY not set" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Prepare and send the email
    console.log(`Attempting to send verification email to ${email}`);
    const emailResponse = await resend.emails.send({
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
    
    console.log("Verification email response:", JSON.stringify(emailResponse));
    
    // Check if there was an error in the response
    if (emailResponse.error) {
      console.error("Error from Resend API:", emailResponse.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: emailResponse.error,
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
        message: "Verification email sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    // Log the full error details
    console.error("Error in send-verification-email function:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
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
