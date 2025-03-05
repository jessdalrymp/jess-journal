
import { ArrowLeft, Home } from 'lucide-react';
import { getChatTitle } from './chatUtils';
import { Link } from 'react-router-dom';

interface ChatHeaderProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
}

export const ChatHeader = ({ type, onBack }: ChatHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-jess-subtle py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="p-1 mr-3 rounded-full hover:bg-jess-subtle transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-medium text-lg">{getChatTitle(type)}</h2>
      </div>
      
      <Link 
        to="/"
        className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors"
      >
        <Home size={18} className="mr-1" />
        <span className="text-sm">Home</span>
      </Link>
    </div>
  );
};
