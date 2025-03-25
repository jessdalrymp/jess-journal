
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
  return (
    errorMessage.includes('rate limit') || 
    errorMessage.includes('429') || 
    errorMessage.includes('too many') ||
    errorMessage.includes('try again later') ||
    errorMessage.includes('exceeded')
  );
};
