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
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Confirmation</title>
          <style>
              body {
                  font-family: 'Open Sans', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              h1, h2 {
                  font-family: 'Cormorant Garamond', Georgia, serif;
                  font-weight: 600;
              }
              .email-container {
                  border: 1px solid #e0d5cc;
                  border-radius: 5px;
                  padding: 20px;
                  background-color: #fcfaf8;
              }
              .header {
                  border-bottom: 2px solid #e0d5cc;
                  padding-bottom: 10px;
                  margin-bottom: 20px;
              }
              .journal-title {
                  text-align: center;
                  margin-bottom: 15px;
                  font-family: 'Cormorant Garamond', Georgia, serif;
                  font-weight: 700;
                  font-size: 32px;
                  color: #8d7160;
                  letter-spacing: 1px;
              }
              h2 {
                  color: #8d7160;
                  margin-top: 0;
              }
              p {
                  font-family: 'Open Sans', Arial, sans-serif;
              }
              .button {
                  display: inline-block;
                  background-color: #8d7160;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 4px;
                  margin: 20px 0;
                  font-family: 'Open Sans', Arial, sans-serif;
              }
              .footer {
                  margin-top: 30px;
                  font-size: 12px;
                  color: #8d7160;
                  text-align: center;
                  border-top: 1px solid #e0d5cc;
                  padding-top: 15px;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <div class="journal-title">JESS Journal</div>
              </div>
              
              <h2>Confirm your sign up to JESS Journal</h2>
              
              <p>Follow this link to confirm your user:</p>
              
              <p><a href="${verificationUrl}" class="button">Confirm your mail</a></p>
              
              <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
              <p>${verificationUrl}</p>
              
              <p>If you didn't request this email, please ignore it.</p>
              
              <div class="footer">
                  <p>&copy; 2025 JESS Journal. All rights reserved.</p>
                  <p>This email was sent to you because someone signed up for JESS Journal using this email address.</p>
              </div>
          </div>
      </body>
      </html>
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
JESS Journal - Email Verification

Confirm your sign up to JESS Journal

Follow this link to confirm your user:
${verificationUrl}

If you didn't request this email, please ignore it.

© 2025 JESS Journal. All rights reserved.
This email was sent to you because someone signed up for JESS Journal using this email address.
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
