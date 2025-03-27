
import { Pencil, Scroll, Compass, Zap, FileText, Heart, Lightbulb, Sun, Moon, Leaf, Rocket, ListChecks, Sparkles } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { JournalEntry } from '@/lib/types';

// Define a type for entry types that includes both core types and extended category types
export type EntryType = JournalEntry['type'] | 
  'morning' | 'evening' | 'gratitude' | 'insights' | 
  'affirmations' | 'selfcare' | 'actionPlan' | 'weekly';

// Interface for icon options to make the function more flexible
interface IconOptions {
  size?: number;
  className?: string;
}

/**
 * Get the appropriate icon for a journal entry type
 * @param type - The entry type
 * @param options - Optional configuration for the icon
 * @returns React JSX Element with the icon
 */
export const getEntryIcon = (type: string, options: IconOptions = {}) => {
  const { size = 16, className = '' } = options;

  // Helper function to create icon with consistent props
  const createIcon = (Icon: LucideIcon, defaultClassName: string = '') => {
    return <Icon size={size} className={`${defaultClassName} ${className}`.trim()} />;
  };
  
  switch (type) {
    // Core entry types
    case 'journal':
      return createIcon(Pencil);
    case 'story':
      return createIcon(Scroll);
    case 'sideQuest':
      return createIcon(Compass);
    case 'action':
      return createIcon(Zap);
    case 'summary':
      return createIcon(FileText, "text-blue-500");
      
    // Additional category-specific icons
    case 'morning':
      return createIcon(Sun, "text-amber-500");
    case 'evening':
      return createIcon(Moon, "text-indigo-500");
    case 'gratitude':
      return createIcon(Heart, "text-rose-500");
    case 'insights':
      return createIcon(Lightbulb, "text-yellow-500");
    case 'affirmations':
      return createIcon(Sparkles, "text-purple-500");
    case 'selfcare':
      return createIcon(Leaf, "text-green-500");
    case 'actionPlan':
      return createIcon(Rocket, "text-cyan-500");
    case 'weekly':
      return createIcon(ListChecks, "text-violet-500");
    default:
      return createIcon(Pencil);
  }
};

/**
 * Get the display name for an entry type
 * @param type - The entry type
 * @returns The human-readable name for the entry type
 */
export const getEntryTypeName = (type: string): string => {
  switch (type) {
    // Core entry types
    case 'journal':
      return 'Journal Entry';
    case 'story':
      return 'Story';
    case 'sideQuest':
      return 'Side Quest';
    case 'action':
      return 'Action Plan';
    case 'summary':
      return 'Daily Summary';
      
    // Additional category types
    case 'morning':
      return 'Morning Reflection';
    case 'evening':
      return 'Evening Reflection';
    case 'gratitude':
      return 'Gratitude Journal';
    case 'insights':
      return 'Insight & Growth';
    case 'affirmations':
      return 'Affirmations';
    case 'selfcare':
      return 'Self-Care Note';
    case 'actionPlan':
      return 'Action & Purpose';
    case 'weekly':
      return 'Weekly Theme';
    default:
      return 'Journal Entry';
  }
};

/**
 * Determine if an entry type is a core type or a category type
 * @param type - The entry type to check
 * @returns boolean indicating if it's a core type
 */
export const isCoreEntryType = (type: string): boolean => {
  return ['journal', 'story', 'sideQuest', 'action', 'summary'].includes(type);
};
