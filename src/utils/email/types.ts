
/**
 * Result of sending a verification email
 */
export interface EmailVerificationResult {
  success: boolean;
  rateLimit?: boolean;
}
