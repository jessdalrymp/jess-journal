
// Email service for sending verification emails

import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "./cors.ts";
import { VerificationRequest, EmailResponse } from "./types.ts";

// Get API key from environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Initialize Resend with the API key
const resend = new Resend(RESEND_API_KEY);

// Validate the email API key
export function validateApiKey(): EmailResponse | null {
  if (!RESEND_API_KEY) {
    console.error("CRITICAL ERROR: RESEND_API_KEY is not set in environment variables");
    return { 
      success: false, 
      error: { 
        message: "Email service configuration error", 
        details: "Missing API key in configuration" 
      }
    };
  }
  
  // Add validation for empty API key
  if (RESEND_API_KEY.trim() === '') {
    console.error("CRITICAL ERROR: RESEND_API_KEY is empty");
    return { 
      success: false, 
      error: { 
        message: "Email service configuration error", 
        details: "API key is empty" 
      }
    };
  }
  
  return null;
}

// Sends HTML-formatted verification email
export async function sendHtmlEmail(email: string, verificationUrl: string): Promise<any> {
  console.log("Sending HTML verification email...");
  
  try {
    return await resend.emails.send({
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
  } catch (error) {
    console.error("Error in sendHtmlEmail:", error);
    throw error;
  }
}

// Sends text-only verification email (fallback)
export async function sendTextOnlyEmail(email: string, verificationUrl: string): Promise<any> {
  console.log("Sending text-only verification email...");
  
  try {
    return await resend.emails.send({
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
  } catch (error) {
    console.error("Error in sendTextOnlyEmail:", error);
    throw error;
  }
}

// Creates error response
export function createErrorResponse(error: any, details?: string): Response {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: error.message || "Unknown error",
      details: details || "Exception caught in send-verification-email function" 
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}
