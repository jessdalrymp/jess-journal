
import { useState } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { ActionButton } from '../ui/ActionButton';
import { useToast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';
import { MoodType } from '@/lib/types';

interface MoodOption {
  type: MoodType;
  emoji: string;
  label: string;
}

const moodOptions: MoodOption[] = [
  { type: 'great', emoji: '😁', label: 'Great' },
  { type: 'good', emoji: '🙂', label: 'Good' },
  { type: 'neutral', emoji: '😐', label: 'Neutral' },
  { type: 'low', emoji: '😕', label: 'Low' },
  { type: 'bad', emoji: '😔', label: 'Bad' },
];

export const MoodCheck = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { addMoodEntry, moodEntries } = useUserData();
  const { toast } = useToast();
  
  // Get the latest mood entry for today
  const today = new Date().toDateString();
  const todaysMood = moodEntries.find(entry => 
    new Date(entry.createdAt).toDateString() === today
  );

  const handleOpenModal = () => {
    setIsOpen(true);
    setSelectedMood(null);
    setNote('');
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setLoading(true);
    try {
      await addMoodEntry(selectedMood, note.trim() || undefined);
      toast({
        title: "Mood recorded",
        description: "Your mood has been saved successfully.",
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error saving mood:', error);
      toast({
        title: "Error saving mood",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!todaysMood ? (
        <div onClick={handleOpenModal} className="cursor-pointer card-base card-hover">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">How are you feeling today?</h3>
              <p className="text-sm text-jess-muted">Track your emotional state</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-jess-subtle flex items-center justify-center">
              <Plus size={20} className="text-jess-primary" />
            </div>
          </div>
        </div>
      ) : (
        <div className="card-base">
          <h3 className="font-medium mb-2">Today's Mood</h3>
          <div className="flex items-center">
            <div className="text-3xl mr-3">
              {moodOptions.find(m => m.type === todaysMood.mood)?.emoji}
            </div>
            <div>
              <p className="font-medium">
                {moodOptions.find(m => m.type === todaysMood.mood)?.label}
              </p>
              {todaysMood.note && (
                <p className="text-sm text-jess-muted">{todaysMood.note}</p>
              )}
            </div>
          </div>
          <button 
            onClick={handleOpenModal}
            className="mt-3 text-sm text-jess-primary hover:underline"
          >
            Update
          </button>
        </div>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">How are you feeling?</h2>
              <button 
                onClick={handleCloseModal}
                className="p-1 rounded-full hover:bg-jess-subtle transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {moodOptions.map((mood) => (
                <button
                  key={mood.type}
                  onClick={() => handleMoodSelect(mood.type)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                    selectedMood === mood.type
                      ? 'bg-jess-primary/10 border border-jess-primary'
                      : 'hover:bg-jess-subtle border border-transparent'
                  }`}
                >
                  <span className="text-2xl mb-1">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </button>
              ))}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-jess-muted mb-2">
                Add a note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input-base min-h-[80px] resize-none"
                placeholder="How are you feeling? What's on your mind?"
              />
            </div>
            
            <div className="flex justify-end">
              <ActionButton
                type="primary"
                onClick={handleSubmit}
                disabled={!selectedMood || loading}
                className="px-6 py-2"
              >
                {loading ? 'Saving...' : 'Save'}
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
