
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/context/UserDataContext';

export const HistoryActionCard = () => {
  const navigate = useNavigate();
  const { fetchJournalEntries } = useUserData();
  
  const handleNewJournal = () => {
    navigate('/journal-history', { state: { showJournalChat: true } });
  };
  
  return (
    <div className="p-4 bg-jess-subtle/40 rounded-xl mb-4">
      <h3 className="text-lg font-medium mb-2">Reflect on your growth</h3>
      <p className="text-jess-muted text-sm mb-3">
        Keep track of your growth by journaling your reflections, insights, and breakthroughs.
        When done, use "Save & Close" to add to your journal.
      </p>
      <Button 
        onClick={handleNewJournal}
        variant="outline" 
        className="w-full bg-white hover:bg-jess-subtle/60 border-jess-subtle flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        <span>New Journal Entry</span>
      </Button>
    </div>
  );
};
