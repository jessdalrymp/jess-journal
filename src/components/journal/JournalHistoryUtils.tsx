
import { JournalEntry } from '@/lib/types';
import { BookOpen, MessageSquare, Zap, PenLine } from 'lucide-react';

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
