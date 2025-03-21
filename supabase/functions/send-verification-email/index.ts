
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest } from "./cors.ts";
import { validateApiKey, sendHtmlEmail, sendTextOnlyEmail, createErrorResponse } from "./emailService.ts";
import { validateRequest, parseRequestBody, createValidationErrorResponse } from "./validation.ts";
import { VerificationRequest } from "./types.ts";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;
  
  console.log("Received verification email request", new Date().toISOString());
  console.log("Request headers:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
  
  try {
    // Validate API key before proceeding
    const apiKeyError = validateApiKey();
    if (apiKeyError) {
      console.error("API key validation failed:", apiKeyError);
      return new Response(
        JSON.stringify(apiKeyError),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Parse request body
    const { data: requestData, error: parseError } = await parseRequestBody(req);
    
    if (parseError || !requestData) {
      console.error("Request parsing failed:", parseError);
      return createValidationErrorResponse("Invalid request format", parseError || "Could not parse JSON body");
    }
    
    const { email, verificationUrl, useTextOnly = false, retryCount = 0 } = requestData;
    
    console.log(`Received request to send verification email to: ${email} (retry: ${retryCount}, text-only: ${useTextOnly})`);
    console.log(`Verification URL: ${verificationUrl}`);
    
    // Validate request data
    const validationError = validateRequest(requestData);
    if (validationError) {
      console.error("Request validation failed:", validationError);
      return new Response(
        JSON.stringify(validationError),
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
        emailResponse = await sendTextOnlyEmail(email, verificationUrl);
        console.log("Text-only email sent successfully");
      } else {
        // Send HTML email (primary attempt)
        emailResponse = await sendHtmlEmail(email, verificationUrl);
        console.log("HTML email sent successfully");
      }
      
      // Validate the email response - sometimes API returns success but with error details
      if (emailResponse && emailResponse.error) {
        console.log("Email API returned an error:", emailResponse.error);
        throw new Error(emailResponse.error.message || "Error in Resend API response");
      }
    } catch (emailError: any) {
      console.error("Exception when calling Resend API:", emailError);
      console.error("Error details:", emailError.stack || "No stack trace available");
      
      // If this was the HTML attempt, try with plain text instead
      if (!useTextOnly) {
        try {
          console.log("First attempt failed, trying with text-only email...");
          emailResponse = await sendTextOnlyEmail(email, verificationUrl);
          
          if (emailResponse && emailResponse.error) {
            console.log("Text-only email also returned an error:", emailResponse.error);
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
    
    return createErrorResponse(error);
  }
};

serve(handler);
