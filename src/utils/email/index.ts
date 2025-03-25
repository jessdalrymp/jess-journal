
// Export all email verification utilities from this index file
export { sendCustomVerificationEmail } from './sendVerificationEmail';
export { checkEmailVerification } from './verificationStatus';
export { isRateLimited } from './rateLimitDetection';
export type { EmailVerificationResult } from './types';
