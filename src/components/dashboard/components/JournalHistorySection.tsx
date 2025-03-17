
import { Link } from 'react-router-dom';
import { History, ArrowRight, Calendar, Clock } from 'lucide-react';

export const JournalHistorySection = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
      {/* Subtle gradient background that moves on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-jess-subtle/10 via-white to-jess-secondary/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-medium bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">Journal History</h2>
          <Link 
            to="/journal-history" 
            className="text-jess-primary text-sm hover:text-jess-foreground transition-colors duration-300 flex items-center gap-1 group"
          >
            View All
            <ArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="space-y-3">
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
          
          {/* Recent Timeline Examples - These show sample entries for new users */}
          <div className="mt-5 space-y-3 pl-2">
            <div className="relative border-l-2 border-jess-subtle pl-4 pb-5">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-jess-secondary"></div>
              <div className="flex items-center text-xs text-jess-muted mb-1">
                <Calendar size={12} className="mr-1" />
                <span>Today</span>
                <Clock size={12} className="ml-2 mr-1" />
                <span>9:30 AM</span>
              </div>
              <p className="text-sm font-medium text-jess-foreground">Morning Reflection</p>
            </div>
            
            <div className="relative border-l-2 border-jess-subtle pl-4 pb-5">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-jess-subtle"></div>
              <div className="flex items-center text-xs text-jess-muted mb-1">
                <Calendar size={12} className="mr-1" />
                <span>Yesterday</span>
                <Clock size={12} className="ml-2 mr-1" />
                <span>8:15 PM</span>
              </div>
              <p className="text-sm font-medium text-jess-foreground">Evening Thoughts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
