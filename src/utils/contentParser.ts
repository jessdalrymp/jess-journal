
/**
 * Attempts to parse journal entry content as JSON, handling code blocks
 */
export const parseEntryContent = (content: string): { title?: string; summary?: string } | null => {
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
    if (parsed && (parsed.title || parsed.summary)) {
      return parsed;
    } else {
      return null;
    }
  } catch (e) {
    console.log("Content is not valid JSON or doesn't have the expected format");
    return null;
  }
};

/**
 * Formats content for editing, ensuring proper code block formatting for JSON
 */
export const formatContentForEditing = (content: string): string => {
  // Check if it's already properly formatted with code blocks
  if (content.trim().startsWith('```json') && content.trim().endsWith('```')) {
    return content;
  }
  
  // Check if it's valid JSON but not in code blocks
  try {
    const parsed = JSON.parse(content);
    if (parsed && (parsed.title || parsed.summary)) {
      // It's valid JSON, format it with code blocks
      return "```json\n" + JSON.stringify(parsed, null, 2) + "\n```";
    }
  } catch (e) {
    // Not valid JSON, return as is
  }
  
  return content;
};

/**
 * Parses content with JSON code blocks, specifically for extracting summaries
 */
export const parseContentWithJsonCodeBlock = (content: string): { title?: string; summary?: string } | null => {
  if (!content) return null;
  
  try {
    // Check for code blocks first
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const match = content.match(jsonRegex);
    
    let contentToProcess = content;
    if (match && match[1]) {
      contentToProcess = match[1].trim();
    }
    
    // Try to parse as JSON
    const parsed = JSON.parse(contentToProcess);
    if (parsed && (parsed.title || parsed.summary)) {
      return parsed;
    }
    
    // If we can't parse the entire content, try to find JSON objects within it
    const jsonObjectRegex = /(\{[\s\S]*?\})/g;
    const jsonMatches = content.match(jsonObjectRegex);
    if (jsonMatches) {
      for (const jsonString of jsonMatches) {
        try {
          const parsed = JSON.parse(jsonString);
          if (parsed && (parsed.title || parsed.summary)) {
            return parsed;
          }
        } catch (e) {
          // Continue to next potential JSON object
        }
      }
    }
    
    return null;
  } catch (e) {
    console.log("Failed to parse content with JSON code block:", e);
    return null;
  }
};

/**
 * Converts third-person references to second-person for a more personal tone
 */
export const convertToSecondPerson = (text: string): string => {
  if (!text) return text;
  
  return text
    .replace(/\bthe user\b/gi, "you")
    .replace(/\bthey (are|were|have|had|will|would|can|could|should|might|must)\b/gi, "you $1")
    .replace(/\btheir\b/gi, "your")
    .replace(/\bthem\b/gi, "you")
    .replace(/\bthemselves\b/gi, "yourself");
};
