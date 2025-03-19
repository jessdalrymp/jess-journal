
/**
 * Attempts to parse journal entry content as JSON, handling code blocks
 */
export const parseEntryContent = (content: string): { title?: string; summary?: string } | null => {
  try {
    if (!content) return null;
    
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
      console.log("Successfully parsed JSON content:", parsed);
      return parsed;
    } else {
      console.log("Parsed JSON but no title/summary found");
      return null;
    }
  } catch (e) {
    // If not valid JSON, try to extract title/summary with regex
    try {
      const titleMatch = content.match(/"title"\s*:\s*"([^"]+)"/);
      const summaryMatch = content.match(/"summary"\s*:\s*"([^"]+)"/);
      
      if (titleMatch?.[1] || summaryMatch?.[1]) {
        const result = {
          title: titleMatch?.[1],
          summary: summaryMatch?.[1]
        };
        console.log("Extracted title/summary with regex:", result);
        return result;
      }
    } catch (regexError) {
      console.log("Regex extraction failed:", regexError);
    }
    
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
 * Gets a preview of the content for display in lists/cards
 */
export const getContentPreview = (entry: any): string => {
  try {
    // First try to parse the content for JSON format
    const parsedContent = parseEntryContent(entry.content);
    if (parsedContent?.summary) {
      return parsedContent.summary.substring(0, 150) + (parsedContent.summary.length > 150 ? '...' : '');
    }
    
    // If there's a prompt, make sure we're only showing the user's response
    if (entry.prompt && entry.content.includes(entry.prompt)) {
      const userResponse = entry.content.replace(entry.prompt, '').trim()
        .replace(/^[\s\n]*[Q|A][:.]?\s*/i, '').trim();
      return userResponse.substring(0, 150) + (userResponse.length > 150 ? '...' : '');
    }
    
    // Fallback to the content itself
    return entry.content.substring(0, 150) + (entry.content.length > 150 ? '...' : '');
  } catch (e) {
    console.error('Error getting content preview:', e);
    return entry.content ? entry.content.substring(0, 150) + '...' : '';
  }
};

