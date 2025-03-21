
// Email service for sending verification emails

import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "./cors.ts";
import { VerificationRequest, EmailResponse } from "./types.ts";

// Get API key from environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_br8VdTu1_B7Mvr846YvJ6CYRyBgip2kUR";

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
  
  console.log("Resend API key is present");
  
  // Basic validation to check API key format
  if (!RESEND_API_KEY.startsWith('re_')) {
    console.error("CRITICAL ERROR: RESEND_API_KEY does not have the expected format (should start with 're_')");
    return { 
      success: false, 
      error: { 
        message: "Email service configuration error", 
        details: "API key has invalid format" 
      }
    };
  }
  
  return null;
}

// Sends HTML-formatted verification email
export async function sendHtmlEmail(email: string, verificationUrl: string): Promise<any> {
  console.log(`Attempting to send HTML verification email to: ${email}`);
  console.log(`Using verification URL: ${verificationUrl}`);
  
  try {
    console.log("Calling Resend API for HTML email...");
    const response = await resend.emails.send({
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
      text: `Welcome to Jess Journal! Thank you for signing up. Please verify your email address by visiting this link: ${verificationUrl}. This link will expire in 24 hours. Best regards, The Jess Journal Team`,
    });
    
    console.log("Resend API response:", JSON.stringify(response, null, 2));
    
    if (response.error) {
      console.error("Error returned from Resend API:", response.error);
      throw new Error(response.error.message || "Unknown Resend API error");
    }
    
    return response;
  } catch (error) {
    console.error("Exception in sendHtmlEmail:", error);
    
    // Check if it's an API key error
    if (error.message && (
        error.message.includes("api_key") || 
        error.message.includes("API key") || 
        error.message.includes("authentication")
    )) {
      console.error("API KEY ERROR: The Resend API key appears to be invalid, expired, or unauthorized");
      throw new Error("Email service authentication failed. Please check your Resend API key.");
    }
    
    // Check if it's a sender domain error
    if (error.message && (
        error.message.includes("domain") || 
        error.message.includes("sender") ||
        error.message.includes("from")
    )) {
      console.error("SENDER DOMAIN ERROR: The sender domain may not be verified in Resend");
      throw new Error("Email sender domain not verified. Please check your Resend domain settings.");
    }
    
    throw error;
  }
}

// Sends text-only verification email (fallback)
export async function sendTextOnlyEmail(email: string, verificationUrl: string): Promise<any> {
  console.log(`Attempting to send text-only verification email to: ${email}`);
  
  try {
    console.log("Calling Resend API for text-only email...");
    const response = await resend.emails.send({
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
    
    console.log("Resend API response:", JSON.stringify(response, null, 2));
    
    if (response.error) {
      console.error("Error returned from Resend API:", response.error);
      throw new Error(response.error.message || "Unknown Resend API error");
    }
    
    return response;
  } catch (error) {
    console.error("Exception in sendTextOnlyEmail:", error);
    
    // Check if it's an API key error
    if (error.message && (
        error.message.includes("api_key") || 
        error.message.includes("API key") || 
        error.message.includes("authentication")
    )) {
      console.error("API KEY ERROR: The Resend API key appears to be invalid, expired, or unauthorized");
      throw new Error("Email service authentication failed. Please check your Resend API key.");
    }
    
    // Check if it's a sender domain error
    if (error.message && (
        error.message.includes("domain") || 
        error.message.includes("sender") ||
        error.message.includes("from")
    )) {
      console.error("SENDER DOMAIN ERROR: The sender domain may not be verified in Resend");
      throw new Error("Email sender domain not verified. Please check your Resend domain settings.");
    }
    
    throw error;
  }
}

// Creates error response
export function createErrorResponse(error: any, details?: string): Response {
  const errorMessage = error.message || "Unknown error";
  const errorDetails = details || "Exception caught in send-verification-email function";
  
  console.error(`Creating error response: ${errorMessage} - ${errorDetails}`);
  
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: errorMessage,
      details: errorDetails 
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}
