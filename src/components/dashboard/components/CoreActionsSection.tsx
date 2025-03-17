
import { Link } from 'react-router-dom';
import { Book, MessageSquare, PenLine, FilePlus } from 'lucide-react';

export const CoreActionsSection = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl font-medium mb-5 bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">Core Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/my-story" className="block aspect-square">
          <div className="bg-gradient-to-br from-jess-subtle to-white rounded-lg h-full p-5 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/80 hover:to-white">
            <div className="text-jess-primary mb-3 transform transition-transform duration-300 group-hover:scale-110">
              <Book size={24} />
            </div>
            <h3 className="text-center">My Story</h3>
          </div>
        </Link>
        
        <Link to="/side-quest" className="block aspect-square">
          <div className="bg-gradient-to-br from-jess-subtle to-white rounded-lg h-full p-5 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/80 hover:to-white">
            <div className="text-jess-primary mb-3">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-center">Side Quest</h3>
          </div>
        </Link>
        
        <Link to="/journal" className="block aspect-square">
          <div className="bg-gradient-to-br from-jess-subtle to-white rounded-lg h-full p-5 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/80 hover:to-white">
            <div className="text-jess-primary mb-3">
              <FilePlus size={24} />
            </div>
            <h3 className="text-center">New Journal Entry</h3>
          </div>
        </Link>
        
        <Link to="/journal-challenge" className="block aspect-square">
          <div className="bg-gradient-to-br from-jess-subtle to-white rounded-lg h-full p-5 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/80 hover:to-white">
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
