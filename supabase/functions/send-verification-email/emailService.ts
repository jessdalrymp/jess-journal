
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
  
  // Log masked API key for debugging (just first/last few chars)
  const keyLength = RESEND_API_KEY.length;
  if (keyLength > 8) {
    const maskedKey = RESEND_API_KEY.substring(0, 4) + '...' + RESEND_API_KEY.substring(keyLength - 4);
    console.log(`Using Resend API key (masked): ${maskedKey}`);
  } else {
    console.log("API key present but too short to display safely");
  }
  
  // Test the API key with a simple validation call (optional)
  try {
    console.log("Attempting to validate Resend API key integrity...");
    // You could make a lightweight call to the Resend API here
    // For example: await resend.domains.list();
    console.log("API key format appears valid (note: this doesn't guarantee it works)");
  } catch (error) {
    console.error("Error during API key validation check:", error);
    // We don't fail here, just log the error
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
    });
    
    console.log("Resend API HTML email response:", JSON.stringify(response, null, 2));
    
    if (response.error) {
      console.error("Error returned from Resend API:", response.error);
      throw new Error(response.error.message || "Unknown Resend API error");
    }
    
    return response;
  } catch (error) {
    console.error("Exception in sendHtmlEmail:", error);
    console.error("Error details:", error.stack || "No stack trace available");
    
    // Log more details about the error for better debugging
    if (error.response) {
      console.error("Error response from Resend API:", error.response);
    }
    
    if (error.message && error.message.includes("api_key")) {
      console.error("API key related error detected. Check if your Resend API key is valid and active.");
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
    
    console.log("Resend API text-only email response:", JSON.stringify(response, null, 2));
    
    if (response.error) {
      console.error("Error returned from Resend API:", response.error);
      throw new Error(response.error.message || "Unknown Resend API error");
    }
    
    return response;
  } catch (error) {
    console.error("Exception in sendTextOnlyEmail:", error);
    console.error("Error details:", error.stack || "No stack trace available");
    
    // Log more details about the error for better debugging
    if (error.response) {
      console.error("Error response from Resend API:", error.response);
    }
    
    if (error.message && error.message.includes("api_key")) {
      console.error("API key related error detected. Check if your Resend API key is valid and active.");
    }
    
    throw error;
  }
}

// Creates error response
export function createErrorResponse(error: any, details?: string): Response {
  const errorMessage = error.message || "Unknown error";
  const errorDetails = details || "Exception caught in send-verification-email function";
  
  console.error(`Creating error response: ${errorMessage} - ${errorDetails}`);
  console.error("Error stack:", error.stack || "No stack trace available");
  
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
