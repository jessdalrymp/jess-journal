
import { Button } from '@/components/ui/button';
import { Plus, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/context/UserDataContext';

export const HistoryActionCard = () => {
  const navigate = useNavigate();
  const { fetchJournalEntries } = useUserData();
  
  const handleNewJournal = () => {
    navigate('/journal-history', { state: { showJournalChat: true } });
  };
  
  const handleWriteFreely = () => {
    // Navigate to the same page, but with a parameter to skip prompt selection
    navigate('/journal-history', { state: { showJournalChat: true, skipPrompt: true } });
  };
  
  return (
    <div className="p-4 bg-jess-subtle/40 rounded-xl mb-4">
      <h3 className="text-lg font-medium mb-2">Reflect on your growth</h3>
      <p className="text-jess-muted text-sm mb-3">
        Keep track of your growth by journaling your reflections, insights, and breakthroughs.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleNewJournal}
          variant="outline" 
          className="w-full bg-white hover:bg-jess-subtle/60 border-jess-subtle flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>New Journal Entry</span>
        </Button>
        <Button 
          onClick={handleWriteFreely}
          variant="outline" 
          className="w-full bg-white hover:bg-jess-subtle/60 border-jess-subtle flex items-center justify-center gap-2"
        >
          <Pencil size={16} />
          <span>Write Freely</span>
        </Button>
      </div>
    </div>
  );
};
