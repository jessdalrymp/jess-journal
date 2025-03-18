
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HistoryViewAllLink = () => {
  return (
    <Link 
      to="/journal-history" 
      className="text-jess-primary text-sm hover:text-jess-foreground transition-colors duration-300 flex items-center gap-1 group"
    >
      View All
      <ArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
};
