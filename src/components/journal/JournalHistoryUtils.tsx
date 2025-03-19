import { Pencil, Scroll, Compass, Zap, FileText } from 'lucide-react';

// Add 'summary' to the entry type icons
export const getEntryIcon = (type: string) => {
  switch (type) {
    case 'journal':
      return <Pencil size={16} />;
    case 'story':
      return <Scroll size={16} />;
    case 'sideQuest':
      return <Compass size={16} />;
    case 'action':
      return <Zap size={16} />;
    case 'summary':
      return <FileText size={16} className="text-blue-500" />;
    default:
      return <Pencil size={16} />;
  }
};

// Update the getEntryTypeName function to include summary
export const getEntryTypeName = (type: string) => {
  switch (type) {
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
    default:
      return 'Journal Entry';
  }
};
