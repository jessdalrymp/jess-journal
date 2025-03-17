
import { Link } from 'react-router-dom';
import { History, ArrowRight } from 'lucide-react';

export const JournalHistorySection = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-medium bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">Journal History</h2>
        <Link to="/journal-history" className="text-jess-primary text-sm hover:text-jess-foreground transition-colors duration-300">View All</Link>
      </div>
      
      <Link to="/journal-history">
        <div className="bg-gradient-to-r from-jess-subtle/80 to-white rounded-lg p-4 flex items-center justify-between cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-r hover:from-jess-secondary/60 hover:to-white">
          <div className="flex items-center">
            <History size={20} className="text-jess-primary mr-3" />
            <span>View your journal history</span>
          </div>
          <ArrowRight size={18} className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </div>
  );
};
