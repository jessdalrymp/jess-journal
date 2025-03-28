/**
 * Extracts formatted content from a journal entry, removing JSON code blocks and other formatting
 */
export const extractFormattedContent = (content: string): string => {
  try {
    // Check if content contains JSON code blocks
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const jsonContent = JSON.parse(jsonMatch[1]);
        // If we have a summary field in the JSON, return that
        if (jsonContent.summary) {
          return jsonContent.summary;
        }
      } catch (e) {
        // If JSON parsing fails, continue with normal content processing
        console.warn('Failed to parse JSON in content', e);
      }
    }
    
    // Try to extract user response from conversation format
    const userResponseMatch = content.match(/user:\s*([\s\S]*?)(?:assistant:|$)/i);
    if (userResponseMatch && userResponseMatch[1]) {
      return userResponseMatch[1].trim();
    }
    
    // Try to extract response after a prompt
    const afterPromptMatch = content.match(/(?:Q:|Question:|Prompt:)[\s\S]*?\n([\s\S]*)/im);
    if (afterPromptMatch && afterPromptMatch[1]) {
      return afterPromptMatch[1].trim();
    }
    
    // Clean up any remaining markdown or code block syntax
    content = content
      .replace(/```json\n[\s\S]*?\n```/g, '') // Remove JSON code blocks
      .replace(/```[\s\S]*?```/g, '')         // Remove other code blocks
      .replace(/^[#]+\s+.*$/gm, '')           // Remove markdown headers
      .trim();
    
    return content;
  } catch (e) {
    console.error('Error extracting formatted content:', e);
    return content || '';
  }
};

/**
 * Parse structured content from a journal entry
 */
export const parseEntryContent = (content: string): { title?: string; summary?: string } | null => {
  try {
    // Try to find JSON content in the content string
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      const jsonContent = JSON.parse(jsonMatch[1]);
      return jsonContent;
    }
    return null;
  } catch (e) {
    console.error('Error parsing entry content:', e);
    return null;
  }
};

/**
 * Get a short preview of content for display in lists
 */
export const getContentPreview = (content: string, maxLength: number = 150): string => {
  const formatted = extractFormattedContent(content);
  if (!formatted) return '';
  
  return formatted.length > maxLength
    ? `${formatted.substring(0, maxLength)}...`
    : formatted;
};

/**
 * Format content for editing - extracts the content from a journal entry for editing
 */
export const formatContentForEditing = (entry: { content: string }): string => {
  try {
    // Check if content has a JSON code block
    const jsonCodeBlockRegex = /```json\s*([\s\S]*?)```/;
    const match = entry.content.match(jsonCodeBlockRegex);
    
    if (match && match[1]) {
      // Return the raw code block for editing
      return entry.content;
    } else {
      // If no JSON code block, return content as is
      return entry.content;
    }
  } catch (e) {
    console.error('Error formatting content for editing:', e);
    return entry.content;
  }
};

/**
 * Parse content that might have a JSON code block
 */
export const parseContentWithJsonCodeBlock = (content: string): { title?: string; summary?: string } | null => {
  try {
    // Try to find JSON content in the content string
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      const jsonContent = JSON.parse(jsonMatch[1]);
      return jsonContent;
    }
    return null;
  } catch (e) {
    console.error('Error parsing content with JSON code block:', e);
    return null;
  }
};
