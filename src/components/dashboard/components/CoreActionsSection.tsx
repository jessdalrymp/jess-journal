
import { Link } from 'react-router-dom';
import { Book, MessageSquare, PenLine, FilePlus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const CoreActionsSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
      {/* Subtle gradient background that moves on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-jess-subtle/10 via-white to-jess-secondary/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <h2 className="text-lg md:text-xl font-medium mb-2 bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">Dashboard</h2>
        <div className="grid grid-cols-2 gap-2">
          <Link to="/my-story" className="block">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-4 flex flex-col items-center justify-center cursor-pointer shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-0.5">
                <Book size={isMobile ? 14 : 12} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className="text-center font-medium text-xs">My Story</h3>
              <p className="text-xs text-center text-jess-muted mt-0.5 max-w-full break-words text-[10px]">Chat about your journey</p>
            </div>
          </Link>
          
          <Link to="/side-quest" className="block">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-4 flex flex-col items-center justify-center cursor-pointer shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-0.5">
                <MessageSquare size={isMobile ? 14 : 12} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className="text-center font-medium text-xs">Side Quest</h3>
              <p className="text-xs text-center text-jess-muted mt-0.5 max-w-full break-words text-[10px]">Explore a new topic</p>
            </div>
          </Link>
          
          <Link to="/journal" className="block">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-4 flex flex-col items-center justify-center cursor-pointer shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-0.5">
                <FilePlus size={isMobile ? 14 : 12} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className="text-center font-medium text-xs">New Entry</h3>
              <p className="text-xs text-center text-jess-muted mt-0.5 max-w-full break-words text-[10px]">Write freely</p>
            </div>
          </Link>
          
          <Link to="/journal-challenge" className="block">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-4 flex flex-col items-center justify-center cursor-pointer shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-0.5">
                <PenLine size={isMobile ? 14 : 12} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className="text-center font-medium text-xs">Journal</h3>
              <p className="text-xs text-center text-jess-muted mt-0.5 max-w-full break-words text-[10px]">Guided prompt</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
