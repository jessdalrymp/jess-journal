/**
 * Attempts to parse journal entry content as JSON, handling code blocks
 */
export const parseEntryContent = (content: string): { title?: string; summary?: string } | null => {
  if (!content) return null;
  
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
    console.log("Successfully parsed content as JSON:", parsed);
    
    if (parsed && (parsed.title || parsed.summary)) {
      return parsed;
    } else {
      // If JSON doesn't have expected fields, check if the content itself might be a summary
      if (typeof content === 'string' && content.length > 0 && !content.includes('{') && !content.includes('}')) {
        return { summary: content };
      }
      console.log("Content parsed as JSON but missing expected fields");
      return null;
    }
  } catch (e) {
    console.log("Could not parse as JSON, checking if it's plain text");
    
    // If not JSON, check if the content itself might be a summary
    if (typeof content === 'string' && content.length > 0 && !content.includes('{') && !content.includes('}')) {
      return { summary: content };
    }
    
    console.log("Content is not valid JSON or plain text summary");
    return null;
  }
};

/**
 * Formats content for editing, ensuring proper code block formatting for JSON
 */
export const formatContentForEditing = (content: string): string => {
  if (!content) return '';
  
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

/**
 * Extracts a preview of content for display in lists
 */
export const getContentPreview = (content: string, maxLength: number = 100): string => {
  if (!content) return '';
  
  // Try to parse as JSON first
  const parsed = parseEntryContent(content);
  if (parsed && parsed.summary) {
    const summary = parsed.summary;
    return summary.length > maxLength 
      ? summary.substring(0, maxLength) + '...' 
      : summary;
  }
  
  // Otherwise, just return the raw content with code blocks removed
  const withoutCodeBlocks = content.replace(/```[^`]*```/g, '').trim();
  return withoutCodeBlocks.length > maxLength 
    ? withoutCodeBlocks.substring(0, maxLength) + '...' 
    : withoutCodeBlocks;
};
