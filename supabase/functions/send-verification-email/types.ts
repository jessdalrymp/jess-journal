
// Types for the verification email function

export interface VerificationRequest {
  email: string;
  verificationUrl: string;
  useTextOnly?: boolean;
  retryCount?: number;
}

export interface EmailError {
  message: string;
  details?: string;
}

export interface EmailResponse {
  success: boolean;
  error?: EmailError;
  data?: any;
}
