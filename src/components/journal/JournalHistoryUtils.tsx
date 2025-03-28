
import { 
  Pencil, Scroll, Compass, Zap, FileText, 
  Heart, Lightbulb, Sun, Moon, Leaf, 
  Rocket, ListChecks, Sparkles 
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { JournalEntry } from '@/lib/types';

// Define a type for entry types that includes both core types and extended category types
export type EntryType = 
  | 'journal' | 'story' | 'sideQuest' | 'action' | 'summary'
  | 'morning' | 'evening' | 'gratitude' | 'insights'
  | 'affirmations' | 'selfcare' | 'actionPlan' | 'weekly';

// Map entry types to icon components
export const ENTRY_TYPE_ICONS: Record<EntryType, {
  icon: LucideIcon;
  className?: string;
}> = {
  // Core entry types
  journal: { icon: Pencil },
  story: { icon: Scroll },
  sideQuest: { icon: Compass },
  action: { icon: Zap },
  summary: { icon: FileText, className: "text-blue-500" },
  
  // Additional category types
  morning: { icon: Sun, className: "text-amber-500" },
  evening: { icon: Moon, className: "text-indigo-500" },
  gratitude: { icon: Heart, className: "text-rose-500" },
  insights: { icon: Lightbulb, className: "text-yellow-500" },
  affirmations: { icon: Sparkles, className: "text-purple-500" },
  selfcare: { icon: Leaf, className: "text-green-500" },
  actionPlan: { icon: Rocket, className: "text-cyan-500" },
  weekly: { icon: ListChecks, className: "text-violet-500" }
};

// Map entry types to display names
export const ENTRY_TYPE_NAMES: Record<EntryType, string> = {
  // Core entry types
  journal: 'Journal Entry',
  story: 'Story',
  sideQuest: 'Side Quest',
  action: 'Action Plan',
  summary: 'Daily Summary',
  
  // Additional category types
  morning: 'Morning Reflection',
  evening: 'Evening Reflection',
  gratitude: 'Gratitude Journal',
  insights: 'Insight & Growth',
  affirmations: 'Affirmations',
  selfcare: 'Self-Care Note',
  actionPlan: 'Action & Purpose',
  weekly: 'Weekly Theme'
};

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
  const entryType = type as EntryType || 'journal';
  const { icon: Icon, className: defaultClassName = '' } = 
    ENTRY_TYPE_ICONS[entryType] || ENTRY_TYPE_ICONS.journal;
  
  return <Icon size={size} className={`${defaultClassName} ${className}`.trim()} />;
};

/**
 * Get the display name for an entry type
 * @param type - The entry type
 * @returns The human-readable name for the entry type
 */
export const getEntryTypeName = (type: string): string => {
  const entryType = type as EntryType || 'journal';
  return ENTRY_TYPE_NAMES[entryType] || ENTRY_TYPE_NAMES.journal;
};

/**
 * Determine if an entry type is a core type or a category type
 * @param type - The entry type to check
 * @returns boolean indicating if it's a core type
 */
export const isCoreEntryType = (type: string): boolean => {
  return ['journal', 'story', 'sideQuest', 'action', 'summary'].includes(type);
};
