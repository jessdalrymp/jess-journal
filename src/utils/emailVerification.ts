
// This file is kept for backward compatibility
// It re-exports all functionality from the refactored email modules

export { 
  sendCustomVerificationEmail,
  checkEmailVerification,
  isRateLimited
} from './email';

export type { EmailVerificationResult } from './email';
