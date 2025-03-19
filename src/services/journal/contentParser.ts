
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
 * Parses content for JSON with code blocks and returns the parsed object
 * This is the function that was missing and causing the errors
 */
export const parseContentWithJsonCodeBlock = (content: string): any | null => {
  try {
    // Try to extract JSON from content if it has code blocks
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const match = content.match(jsonRegex);
    const contentToProcess = match && match[1] ? match[1].trim() : content;
    
    // Try to parse as JSON
    return JSON.parse(contentToProcess);
  } catch (e) {
    console.log("Failed to parse JSON from content:", e);
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
