
import { Link } from 'react-router-dom';
import { Book, MessageSquare, PenLine, FilePlus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const CoreActionsSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
      {/* Subtle gradient background that moves on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-jess-subtle/10 via-white to-jess-secondary/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-medium mb-5 bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">Core Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/my-story" className="block aspect-square">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-4 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-2">
                <Book size={isMobile ? 40 : 36} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className={`text-center font-medium ${isMobile ? 'text-xl md:text-2xl' : 'text-2xl'}`}>My Story</h3>
              <p className={`${isMobile ? 'text-sm md:text-base' : 'text-base'} text-center text-jess-muted mt-1 max-w-full break-words`}>Chat about your journey</p>
            </div>
          </Link>
          
          <Link to="/side-quest" className="block aspect-square">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-4 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-2">
                <MessageSquare size={isMobile ? 40 : 36} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className={`text-center font-medium ${isMobile ? 'text-xl md:text-2xl' : 'text-2xl'}`}>Side Quest</h3>
              <p className={`${isMobile ? 'text-sm md:text-base' : 'text-base'} text-center text-jess-muted mt-1 max-w-full break-words`}>Explore a new topic</p>
            </div>
          </Link>
          
          <Link to="/journal" className="block aspect-square">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-4 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-2">
                <FilePlus size={isMobile ? 40 : 36} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className={`text-center font-medium ${isMobile ? 'text-xl md:text-2xl' : 'text-2xl'}`}>New Entry</h3>
              <p className={`${isMobile ? 'text-sm md:text-base' : 'text-base'} text-center text-jess-muted mt-1 max-w-full break-words`}>Write freely</p>
            </div>
          </Link>
          
          <Link to="/journal-challenge" className="block aspect-square">
            <div className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-4 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50">
              <div className="text-jess-primary mb-2">
                <PenLine size={isMobile ? 40 : 36} className="transition-transform duration-300 hover:scale-110" />
              </div>
              <h3 className={`text-center font-medium ${isMobile ? 'text-xl md:text-2xl' : 'text-2xl'}`}>Journal</h3>
              <p className={`${isMobile ? 'text-sm md:text-base' : 'text-base'} text-center text-jess-muted mt-1 max-w-full break-words`}>Guided prompt</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
