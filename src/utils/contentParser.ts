
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
  // If it's already properly formatted, return as is
  if (content.trim().startsWith('```json') && content.trim().endsWith('```')) {
    return content;
  }
  
  // Check if it's valid JSON but not in code blocks
  try {
    // First check if this might be inside code blocks that we need to extract
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const match = content.match(jsonRegex);
    let contentToProcess = content;
    
    if (match && match[1]) {
      contentToProcess = match[1].trim();
    }
    
    // Now try to parse it
    const parsed = JSON.parse(contentToProcess);
    if (parsed && (parsed.title || parsed.summary)) {
      // Format it nicely for editing
      return content.trim().startsWith('```json') ? 
        content : 
        "```json\n" + JSON.stringify(parsed, null, 2) + "\n```";
    }
  } catch (e) {
    // Not valid JSON, return as is
  }
  
  return content;
};
