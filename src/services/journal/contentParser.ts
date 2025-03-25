
import { convertToSecondPerson } from '@/utils/contentParser';

/**
 * Parses content from a journal entry that may be contained in a code block
 */
export const parseContentWithJsonCodeBlock = (content: string) => {
  try {
    if (!content) return null;
    
    // Check if the content is wrapped in a JSON code block
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const match = content.match(jsonRegex);
    
    let contentToProcess = content;
    
    if (match && match[1]) {
      contentToProcess = match[1].trim();
    }
    
    // Try to parse as JSON
    const parsed = JSON.parse(contentToProcess);
    
    // Convert any summary from third-person to second-person
    if (parsed.summary) {
      parsed.summary = convertToSecondPerson(parsed.summary);
    }
    
    return parsed;
  } catch (e) {
    console.error('Error parsing content with JSON code block:', e);
    return null;
  }
};
