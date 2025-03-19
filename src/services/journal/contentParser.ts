
/**
 * Parses journal content that might be JSON in a code block
 */
export const parseContentWithJsonCodeBlock = (content: string) => {
  try {
    // First, try to detect if this is a JSON string inside code blocks
    let contentToProcess = content;
    
    // Remove code block markers if present
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const match = content.match(jsonRegex);
    if (match && match[1]) {
      contentToProcess = match[1].trim();
    }
    
    // Try to parse as JSON
    const parsed = JSON.parse(contentToProcess);
    return parsed;
  } catch (e) {
    // If parsing fails, return null
    return null;
  }
};
