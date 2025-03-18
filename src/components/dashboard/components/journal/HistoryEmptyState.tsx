
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HistoryEmptyState = () => {
  return (
    <div className="text-center py-4">
      <p className="text-sm text-jess-muted mb-2">No journal entries yet</p>
      <Link 
        to="/journal-challenge" 
        className="inline-flex items-center text-xs text-jess-primary hover:text-jess-foreground"
      >
        Start journaling
        <ArrowRight size={12} className="ml-1" />
      </Link>
    </div>
  );
};
