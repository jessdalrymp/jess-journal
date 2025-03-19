
import { Pencil, Scroll, Compass, Zap, FileText, Heart, Lightbulb, Sun, Moon, Leaf, Rocket, ListChecks, Sparkles } from 'lucide-react';

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
    // Additional category-specific icons that can be used
    case 'morning':
      return <Sun size={16} className="text-amber-500" />;
    case 'evening':
      return <Moon size={16} className="text-indigo-500" />;
    case 'gratitude':
      return <Heart size={16} className="text-rose-500" />;
    case 'insights':
      return <Lightbulb size={16} className="text-yellow-500" />;
    case 'affirmations':
      return <Sparkles size={16} className="text-purple-500" />;
    case 'selfcare':
      return <Leaf size={16} className="text-green-500" />;
    case 'actionPlan':
      return <Rocket size={16} className="text-cyan-500" />;
    case 'weekly':
      return <ListChecks size={16} className="text-violet-500" />;
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
    // Additional category names
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
