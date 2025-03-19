
// Type definitions for the verification email function

export interface VerificationRequest {
  email: string;
  verificationUrl: string;
  useTextOnly?: boolean;
  retryCount?: number;
}

export interface EmailResponse {
  success: boolean;
  data?: any;
  error?: {
    message: string;
    details?: string;
  };
  textOnly?: boolean;
  message?: string;
}
