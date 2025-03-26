
import { Link } from 'react-router-dom';
import { History, ArrowRight } from 'lucide-react';

export const HistoryActionCard = () => {
  return (
    <Link to="/journal-history">
      <div className="bg-gradient-to-r from-jess-subtle/80 to-white rounded-lg p-4 flex items-center justify-between cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-r hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50 group">
        <div className="flex items-center">
          <div className="bg-jess-primary/10 p-2 rounded-full">
            <History size={20} className="text-jess-primary" />
          </div>
          <span className="ml-3 font-medium">View your journal history</span>
        </div>
        <ArrowRight size={18} className="transform transition-transform duration-300 group-hover:translate-x-1 text-jess-primary/80" />
      </div>
    </Link>
  );
};
