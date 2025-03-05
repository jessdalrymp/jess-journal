
import { ArrowLeft } from 'lucide-react';
import { getChatTitle } from './chatUtils';

interface ChatHeaderProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
}

export const ChatHeader = ({ type, onBack }: ChatHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-jess-subtle py-3 px-4 flex items-center">
      <button
        onClick={onBack}
        className="p-1 mr-3 rounded-full hover:bg-jess-subtle transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>
      <h2 className="font-medium text-lg">{getChatTitle(type)}</h2>
    </div>
  );
};
