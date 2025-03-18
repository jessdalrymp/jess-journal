
import { ArrowRight, History } from 'lucide-react';

interface JournalHistoryButtonProps {
  onClick: () => void;
}

export const JournalHistoryButton = ({ onClick }: JournalHistoryButtonProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-jess-subtle rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex items-center">
        <History size={20} className="text-jess-primary mr-3" />
        <span>View your journal history</span>
      </div>
      <ArrowRight size={18} />
    </div>
  );
};
