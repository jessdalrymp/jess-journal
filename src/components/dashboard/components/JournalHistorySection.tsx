
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, ArrowRight, Bookmark } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchSavedPrompts } from '../../../services/savedPromptsService';
import { Card } from '@/components/ui/card';

export const JournalHistorySection = () => {
  const [savedPromptsCount, setSavedPromptsCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const loadSavedPromptsCount = async () => {
      if (user) {
        try {
          const prompts = await fetchSavedPrompts(user.id);
          setSavedPromptsCount(prompts.length);
        } catch (error) {
          console.error("Error fetching saved prompts count:", error);
        }
      }
    };

    loadSavedPromptsCount();
  }, [user]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-medium">Journal History</h2>
        <Link to="/journal-history" className="text-jess-primary text-sm">View All</Link>
      </div>
      
      <div className="space-y-3">
        <Link to="/journal-history">
          <div className="bg-jess-subtle rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center">
              <History size={20} className="text-jess-primary mr-3" />
              <span>View your journal history</span>
            </div>
            <ArrowRight size={18} />
          </div>
        </Link>

        <Link to="/journal-challenge">
          <div className="bg-jess-subtle rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center">
              <Bookmark size={20} className="text-jess-primary mr-3" />
              <span>
                {savedPromptsCount > 0 
                  ? `You have ${savedPromptsCount} saved prompt${savedPromptsCount === 1 ? '' : 's'}`
                  : 'Save journal prompts for later'}
              </span>
            </div>
            <ArrowRight size={18} />
          </div>
        </Link>
      </div>
    </div>
  );
};
