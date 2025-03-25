
import { JournalEntry } from "@/lib/types";

/**
 * Converts third-person language to second-person in a given text.
 * @param {string} text - The input text to convert.
 * @returns {string} The converted text with second-person language.
 */
export const convertToSecondPerson = (text: string): string => {
  if (!text) return '';
  
  // Basic replacements for common pronouns and possessive adjectives
  let convertedText = text.replace(/\bI\b/g, 'you');
  convertedText = convertedText.replace(/\bme\b/g, 'you');
  convertedText = convertedText.replace(/\bmy\b/g, 'your');
  convertedText = convertedText.replace(/\bmine\b/g, 'yours');
  convertedText = convertedText.replace(/\bmyself\b/g, 'yourself');
  
  // Handle third-person pronouns
  convertedText = convertedText.replace(/\bhe\b/gi, 'you');
  convertedText = convertedText.replace(/\bshe\b/gi, 'you');
  convertedText = convertedText.replace(/\bhim\b/gi, 'you');
  convertedText = convertedText.replace(/\bher\b/gi, 'you');
  convertedText = convertedText.replace(/\bhers\b/gi, 'yours');
  convertedText = convertedText.replace(/\bhisself\b/gi, 'yourself');
  convertedText = convertedText.replace(/\bherself\b/gi, 'yourself');
  
  // Handle "one" and "oneself"
  convertedText = convertedText.replace(/\bone\b/gi, 'you');
  convertedText = convertedText.replace(/\boneself\b/gi, 'yourself');

  // Convert "we" to "you" in most contexts, but be cautious
  convertedText = convertedText.replace(/\bwe\b/gi, 'you');
  convertedText = convertedText.replace(/\bour\b/gi, 'your');
  convertedText = convertedText.replace(/\bourselves\b/gi, 'yourselves');
  convertedText = convertedText.replace(/\bus\b/gi, 'you');
  
  // Convert "they" and related pronouns to "you"
  convertedText = convertedText.replace(/\bthey\b/gi, 'you');
  convertedText = convertedText.replace(/\bthem\b/gi, 'you');
  convertedText = convertedText.replace(/\btheir\b/gi, 'your');
  convertedText = convertedText.replace(/\btheirs\b/gi, 'yours');
  convertedText = convertedText.replace(/\bthemselves\b/gi, 'yourselves');
  
  // Convert "the user" to "you"
  convertedText = convertedText.replace(/\bthe user\b/gi, 'you');
  
  return convertedText;
};

/**
 * Extract a preview of content, handling different formats
 */
export const getContentPreview = (entry: JournalEntry): string => {
  // Try to parse as JSON if it appears to be in JSON format
  if (entry.content.includes('{') && entry.content.includes('}')) {
    try {
      // Check for JSON code blocks
      const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
      const match = entry.content.match(jsonRegex);
      
      if (match && match[1]) {
        const parsedJson = JSON.parse(match[1].trim());
        if (parsedJson.summary) {
          return convertToSecondPerson(parsedJson.summary);
        }
      }

      // Try parsing directly if no code blocks
      const parsedContent = JSON.parse(entry.content);
      if (parsedContent.summary) {
        return convertToSecondPerson(parsedContent.summary);
      }
    } catch (e) {
      // If parsing fails, continue to normal text processing
    }
  }

  // For freewriting entries or when JSON parsing fails
  // Remove the prompt from the content if it exists
  let displayContent = entry.content;
  if (entry.prompt && displayContent.includes(entry.prompt)) {
    displayContent = displayContent.replace(entry.prompt, '').trim();
    
    // Also remove any Q: or A: prefixes that might remain
    displayContent = displayContent.replace(/^[\s\n]*[Q|A][:.]?\s*/im, '').trim();
  }
  
  // Apply second-person language conversion
  displayContent = convertToSecondPerson(displayContent);
  
  // Return a limited preview
  return displayContent.length > 150 ? displayContent.substring(0, 150) + '...' : displayContent;
};

/**
 * Parse entry content to extract structured information
 */
export const parseEntryContent = (content: string): { title?: string; summary?: string } | null => {
  // Check if it might be in JSON format
  if (content.includes('{') && content.includes('}')) {
    try {
      // First check for JSON code blocks
      const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
      const match = content.match(jsonRegex);
      
      if (match && match[1]) {
        const parsedJson = JSON.parse(match[1].trim());
        return {
          title: parsedJson.title,
          summary: parsedJson.summary ? convertToSecondPerson(parsedJson.summary) : undefined
        };
      }
      
      // If no code blocks, try parsing directly
      const parsedContent = JSON.parse(content);
      return {
        title: parsedContent.title,
        summary: parsedContent.summary ? convertToSecondPerson(parsedContent.summary) : undefined
      };
    } catch (e) {
      // If JSON parsing fails, return null to use the default processing
      console.error('Error parsing entry content:', e);
      return null;
    }
  }
  
  // For plain text content with no JSON structure
  return null;
};

/**
 * Format entry content for editing, extracting the appropriate content
 * based on whether it's structured or freewriting
 */
export const formatContentForEditing = (content: string): string => {
  try {
    // Check if this is JSON content
    if (content.includes('```json')) {
      return content;
    }
    
    // Check if this might be direct JSON
    if (content.includes('{') && content.includes('}')) {
      try {
        // Try parsing as direct JSON
        JSON.parse(content);
        // If successful, it's already valid JSON, return as is
        return content;
      } catch (e) {
        // Not valid JSON, treat as freewriting
      }
    }
    
    // For freewriting content, return as is
    return content;
  } catch (e) {
    console.error('Error formatting content for editing:', e);
    return content;
  }
};
