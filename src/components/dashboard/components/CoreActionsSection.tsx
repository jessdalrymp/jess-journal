
import { Link } from 'react-router-dom';
import { Book, MessageSquare, PenLine, FilePlus } from 'lucide-react';

export const CoreActionsSection = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-medium mb-5">Core Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/my-story">
          <div className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all">
            <div className="text-jess-primary mb-3">
              <Book size={24} />
            </div>
            <h3 className="text-center">My Story</h3>
          </div>
        </Link>
        
        <Link to="/side-quest">
          <div className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all">
            <div className="text-jess-primary mb-3">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-center">Side Quest</h3>
          </div>
        </Link>
        
        <Link to="/journal">
          <div className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all">
            <div className="text-jess-primary mb-3">
              <FilePlus size={24} />
            </div>
            <h3 className="text-center">New Journal Entry</h3>
          </div>
        </Link>
        
        <Link to="/journal-challenge">
          <div className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all">
            <div className="text-jess-primary mb-3">
              <PenLine size={24} />
            </div>
            <h3 className="text-center">Journal Challenge</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};
