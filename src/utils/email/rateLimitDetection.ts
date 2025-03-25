
/**
 * Checks if an error message or status code indicates a rate limit
 * 
 * @param errorMessage Error message to check
 * @param statusCode Optional HTTP status code
 * @returns Boolean indicating if the error appears to be rate limited
 */
export const isRateLimited = (errorMessage?: string, statusCode?: number): boolean => {
  // Check status code first - 429 is standard rate limit code
  if (statusCode === 429) {
    return true;
  }
  
  // If no message provided, can't detect from message
  if (!errorMessage) {
    return false;
  }
  
  // Check for common rate limit phrases in the error message
  const rateLimitPhrases = [
    'rate limit',
    'ratelimit',
    '429',
    'too many',
    'try again later',
    'exceeded',
    'too many attempts',
    'too many requests',
    'attempt limit',
    'request limit',
    'limit reached',
    'throttled',
    'slow down',
    'wait',
    'cool down',
    'timeout',
    'maximum attempts',
    'over_email_send_rate_limit',  // Add specific Supabase rate limit error code
    'temporarily locked'  // Common phrase in authentication rate limiting
  ];
  
  const lowerCaseMessage = errorMessage.toLowerCase();
  return rateLimitPhrases.some(phrase => lowerCaseMessage.includes(phrase));
};

/**
 * Get a user-friendly message for rate limit errors
 * based on the context/component where the error occurred
 * 
 * @param context The area where the rate limit occurred (signup, login, reset, etc.)
 * @returns A user-friendly message explaining the rate limit
 */
export const getRateLimitMessage = (context: 'signup' | 'login' | 'reset' | 'verification' | 'general' = 'general'): string => {
  switch (context) {
    case 'signup':
      return "For security reasons, please wait a few minutes before trying to sign up again.";
    case 'login':
      return "Your account is temporarily locked due to multiple login attempts. Please wait a few minutes before trying again, or use the 'Forgot Password' option.";
    case 'reset':
      return "You've recently requested a password reset. Please check your email or wait a few minutes before requesting another.";
    case 'verification':
      return "We've sent the verification email. Please check your inbox and spam folder, or wait a few minutes before requesting another.";
    case 'general':
    default:
      return "Too many attempts. Please try again after a few minutes.";
  }
};

/**
 * Calculate a suggested wait time based on the number of attempts
 * 
 * @param attempts Number of attempts made (optional)
 * @returns Suggested wait time in minutes
 */
export const getSuggestedWaitTime = (attempts = 1): number => {
  // Exponential backoff: 1 min, 2 mins, 4 mins, 8 mins, max 15 mins
  const waitTime = Math.min(Math.pow(2, attempts - 1), 15);
  return Math.max(1, waitTime); // Minimum 1 minute
};
