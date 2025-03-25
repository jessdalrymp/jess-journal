
// Validation utilities for the verification email function

import { corsHeaders } from "./cors.ts";
import { VerificationRequest, EmailResponse } from "./types.ts";

// Validate request data
export function validateRequest(requestData: VerificationRequest): EmailResponse | null {
  const { email, verificationUrl } = requestData;
  
  // Log the received request data for debugging
  console.log("Validating request data:", JSON.stringify(requestData, null, 2));
  
  if (!email || !verificationUrl) {
    console.error("Missing required parameters: email or verificationUrl");
    return { 
      success: false, 
      error: { 
        message: "Missing required parameters: email or verificationUrl" 
      }
    };
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Invalid email format:", email);
    return { 
      success: false, 
      error: { 
        message: "Invalid email format" 
      }
    };
  }
  
  // URL validation - ensure it has expected format
  try {
    new URL(verificationUrl);
  } catch (urlError) {
    console.error("Invalid verification URL:", verificationUrl);
    return { 
      success: false, 
      error: { 
        message: "Invalid verification URL format" 
      }
    };
  }
  
  return null;
}

// Parse request body
export async function parseRequestBody(req: Request): Promise<{ data: VerificationRequest | null, error: string | null }> {
  try {
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody.substring(0, 200) + (rawBody.length > 200 ? "..." : ""));
    
    // Parse the JSON body
    const parsedBody = JSON.parse(rawBody);
    console.log("Parsed request body:", JSON.stringify(parsedBody, null, 2));
    
    // Ensure we have a valid VerificationRequest object
    const verificationRequest: VerificationRequest = {
      email: parsedBody.email,
      verificationUrl: parsedBody.verificationUrl,
      useTextOnly: parsedBody.useTextOnly || false,
      retryCount: parsedBody.retryCount || 0
    };
    
    return { data: verificationRequest, error: null };
  } catch (parseError) {
    console.error("Error parsing request body:", parseError);
    return { 
      data: null, 
      error: "Could not parse JSON body: " + (parseError instanceof Error ? parseError.message : String(parseError))
    };
  }
}

// Create a validation error response
export function createValidationErrorResponse(errorMessage: string, details?: string): Response {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: {
        message: errorMessage,
        details: details
      }
    }),
    {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}
