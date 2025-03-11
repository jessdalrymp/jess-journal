
import { Link } from 'react-router-dom';
import { History, ArrowRight } from 'lucide-react';

export const JournalHistorySection = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-medium">Journal History</h2>
        <Link to="/journal-history" className="text-jess-primary text-sm">View All</Link>
      </div>
      
      <Link to="/journal-history">
        <div className="bg-jess-subtle rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
          <div className="flex items-center">
            <History size={20} className="text-jess-primary mr-3" />
            <span>View your journal history</span>
          </div>
          <ArrowRight size={18} />
        </div>
      </Link>
    </div>
  );
};
