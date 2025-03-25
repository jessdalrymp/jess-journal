
/**
 * Checks if an error message or status code indicates a rate limit
 * 
 * @param errorMessage Error message to check
 * @param statusCode Optional HTTP status code
 * @returns Boolean indicating if the error appears to be rate limit related
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
    'maximum attempts'
  ];
  
  const lowerCaseMessage = errorMessage.toLowerCase();
  return rateLimitPhrases.some(phrase => lowerCaseMessage.includes(phrase));
};
