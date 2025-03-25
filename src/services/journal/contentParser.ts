
import { parseEntryContent, getContentPreview, formatContentForEditing } from '../../utils/contentParser';

// Re-export the utility functions for backward compatibility
export const parseContentWithJsonCodeBlock = (content: string) => {
  const result = parseEntryContent(content);
  return result || null;
};

// Export the functions to maintain API compatibility
export { getContentPreview, formatContentForEditing };

