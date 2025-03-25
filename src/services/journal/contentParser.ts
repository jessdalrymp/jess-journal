
import { parseEntryContent, getContentPreview } from '../../utils/contentParser';

// Re-export the utility functions for backward compatibility
export const parseContentWithJsonCodeBlock = (content: string) => {
  const result = parseEntryContent(content);
  return result || null;
};

// Export the getContentPreview function to maintain API compatibility
export { getContentPreview };
