
import { HistoryViewAllLink } from './HistoryViewAllLink';

export const HistorySectionHeading = () => {
  return (
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-xl font-medium bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">Journal History</h2>
      <HistoryViewAllLink />
    </div>
  );
};
