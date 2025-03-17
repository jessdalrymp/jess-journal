
import { Link } from 'react-router-dom';
import { Book, MessageSquare, PenLine, FilePlus } from 'lucide-react';

export const CoreActionsSection = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
      {/* Subtle gradient background that moves on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-jess-subtle/10 via-white to-jess-secondary/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <h2 className="text-xl font-medium mb-5 bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">Core Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/my-story" className="block aspect-square">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-5 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-3 transform transition-transform duration-300 group-hover:scale-110">
                <Book size={24} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className="text-center font-medium">My Story</h3>
              <p className="text-xs text-center text-jess-muted mt-1">Chat about your journey</p>
            </div>
          </Link>
          
          <Link to="/side-quest" className="block aspect-square">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-5 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-3">
                <MessageSquare size={24} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className="text-center font-medium">Side Quest</h3>
              <p className="text-xs text-center text-jess-muted mt-1">Explore a new topic</p>
            </div>
          </Link>
          
          <Link to="/journal" className="block aspect-square">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-5 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-3">
                <FilePlus size={24} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className="text-center font-medium">New Journal Entry</h3>
              <p className="text-xs text-center text-jess-muted mt-1">Write freely</p>
            </div>
          </Link>
          
          <Link to="/journal-challenge" className="block aspect-square">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-5 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-3">
                <PenLine size={24} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className="text-center font-medium">Journal Challenge</h3>
              <p className="text-xs text-center text-jess-muted mt-1">Guided reflection prompt</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
