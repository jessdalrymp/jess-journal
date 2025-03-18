
import { JournalEntry } from '@/lib/types';
import { BookOpen, MessageSquare, Zap, PenLine } from 'lucide-react';
import { parseContentWithJsonCodeBlock } from '@/services/journal';

export const getEntryIcon = (type: string) => {
  switch (type) {
    case 'story':
      return <BookOpen size={18} className="text-blue-500" />;
    case 'sideQuest':
      return <MessageSquare size={18} className="text-purple-500" />;
    case 'action':
      return <Zap size={18} className="text-amber-500" />;
    case 'journal':
      return <PenLine size={18} className="text-green-500" />;
    default:
      return <PenLine size={18} className="text-jess-muted" />;
  }
};

export const getEntryTypeName = (type: string) => {
  switch (type) {
    case 'story':
      return 'My Story';
    case 'sideQuest':
      return 'Side Quest';
    case 'action':
      return 'Action Challenge';
    case 'journal':
      return 'Journal Challenge';
    default:
      return 'Entry';
  }
};

// Function to parse the entry content for potential JSON with a title or summary
export const getEntryTitle = (entry: JournalEntry) => {
  try {
    // Parse the content to get the user's answer instead of the question
    const parsedContent = parseContentWithJsonCodeBlock(entry.content);
    
    if (parsedContent) {
      // If we have a summary field (user's answer), use that for the display
      if (parsedContent.summary) {
        // Use the first line or first 50 characters of the summary
        let summaryText = parsedContent.summary.split('\n')[0];
        
        // Replace third-person pronouns with second-person
        summaryText = summaryText
          .replace(/\bthe user\b/gi, "you")
          .replace(/\bthey (are|were|have|had|will|would|can|could|should|might|must)\b/gi, "you $1")
          .replace(/\btheir\b/gi, "your")
          .replace(/\bthem\b/gi, "you")
          .replace(/\bthemselves\b/gi, "yourself");
        
        return summaryText.length > 50 
          ? summaryText.substring(0, 50) + '...' 
          : summaryText;
      }
      
      // Fallback to title if present
      if (parsedContent.title) {
        // Also personalize the title if possible
        let title = parsedContent.title
          .replace(/\bthe user\b/gi, "you")
          .replace(/\bthey (are|were|have|had|will|would|can|could|should|might|must)\b/gi, "you $1")
          .replace(/\btheir\b/gi, "your")
          .replace(/\bthem\b/gi, "you")
          .replace(/\bthemselves\b/gi, "yourself");
          
        return title;
      }
    }
  } catch (e) {
    // Not valid JSON or doesn't have the expected fields
  }
  
  // Fallback to the original title
  return entry.title;
};
