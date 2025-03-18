
import { Clock } from 'lucide-react';

export const JournalHistoryEmptyState = () => {
  return (
    <div className="text-center p-6 text-jess-muted">
      <Clock size={48} className="mx-auto opacity-50 mb-2" />
      <p className="text-jess-muted mb-1">Your journal history will appear here</p>
      <p className="text-sm text-jess-muted">Start a conversation to begin</p>
    </div>
  );
};
