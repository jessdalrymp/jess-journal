
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';
import { Sun, Moon, Heart, Lightbulb, Leaf, Rocket, ListChecks } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Define prompt categories and their prompts
const promptCategories = [
  {
    id: 'morning',
    name: 'Morning Reflections',
    icon: <Sun className="h-5 w-5 text-amber-500" />,
    prompts: [
      "What is my intention for today?",
      "What's one small step I can take today to honor my values?",
      "How do I want to feel by the end of today?",
      "What positive outcome do I want to visualize for today?",
      "What strength will I lean into today?"
    ]
  },
  {
    id: 'evening',
    name: 'Evening Reflections',
    icon: <Moon className="h-5 w-5 text-indigo-500" />,
    prompts: [
      "What moment today made me feel most alive?",
      "What challenges did I encounter today, and how did I grow from them?",
      "What's one thing I learned about myself today?",
      "How did I align with my values today?",
      "What would I do differently if given another chance today?"
    ]
  },
  {
    id: 'gratitude',
    name: 'Daily Gratitude',
    icon: <Heart className="h-5 w-5 text-rose-500" />,
    prompts: [
      "List three specific things I'm grateful for right now.",
      "Who positively impacted my life today?",
      "What's one ordinary thing I often overlook but deeply appreciate?",
      "What's a recent experience I'm thankful to have had?",
      "How can I express my gratitude to someone today?"
    ]
  },
  {
    id: 'insights',
    name: 'Daily Insights & Growth',
    icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
    prompts: [
      "What's a belief I've held recently that's limiting me?",
      "What's a recent realization or breakthrough I've experienced?",
      "What emotions am I currently experiencing, and what are they telling me?",
      "How am I resisting change, and what step can I take to embrace it?",
      "What's something uncomfortable I might need to face to grow?"
    ]
  },
  {
    id: 'selfcare',
    name: 'Self-Care & Mindfulness',
    icon: <Leaf className="h-5 w-5 text-green-500" />,
    prompts: [
      "How will I nurture my mental and emotional well-being today?",
      "What boundaries do I need to reinforce today?",
      "What's one act of kindness I can show myself today?",
      "How will I practice mindfulness or grounding today?",
      "In what ways can I slow down and be present?"
    ]
  },
  {
    id: 'action',
    name: 'Action & Purpose',
    icon: <Rocket className="h-5 w-5 text-cyan-500" />,
    prompts: [
      "What's a meaningful action step I can take towards my goals today?",
      "Who can I support or inspire today?",
      "How am I contributing positively to my community or the world around me?",
      "What's one decision today that aligns powerfully with my purpose?",
      "What small act of courage can I take today?"
    ]
  },
  {
    id: 'weekly',
    name: 'Weekly Themes',
    icon: <ListChecks className="h-5 w-5 text-violet-500" />,
    prompts: [
      "Week of Courage: What's one courageous act I'll commit to today?",
      "Week of Simplicity: How can I simplify my day today?",
      "Week of Connection: Who can I meaningfully connect with today?",
      "Week of Growth: What habit am I developing this week?",
      "Week of Creativity: How will I express my creativity today?"
    ]
  }
];

export type PromptCategory = typeof promptCategories[0];
export type Prompt = string;

interface QuickJournalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: PromptCategory | null;
  prompt: Prompt | null;
}

const QuickJournalDialog = ({ isOpen, onClose, category, prompt }: QuickJournalDialogProps) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { fetchJournalEntries } = useUserData();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!user || !content.trim() || !prompt || !category) return;
    
    setIsSaving(true);
    
    try {
      // Create a journal entry with JSON format for better structure
      const journalContent = JSON.stringify({
        title: `${category.name}: ${prompt.substring(0, 40)}...`,
        summary: content,
        type: category.id
      });
      
      // Save the entry using the journalService
      const { saveJournalEntry } = await import('@/hooks/journal/useJournalCreate');
      const { saveJournalEntry: saveEntry } = saveJournalEntry();
      
      await saveEntry(user.id, prompt, journalContent);
      
      // Refresh journal entries
      fetchJournalEntries();
      
      toast({
        title: "Journal entry saved",
        description: `Your ${category.name.toLowerCase()} has been saved successfully.`,
      });
      
      // Close the dialog and reset content
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error saving entry",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {category?.icon}
            <span>{category?.name}</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">{prompt}</p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="min-h-[200px]"
          />
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!content.trim() || isSaving}>
              {isSaving ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const JournalPromptCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePromptClick = (category: PromptCategory, prompt: Prompt) => {
    setSelectedCategory(category);
    setSelectedPrompt(prompt);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPrompt(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-jess-foreground">
        Daily Journaling Prompts
      </h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promptCategories.map((category) => (
          <div 
            key={category.id}
            className="bg-white shadow rounded-lg overflow-hidden border border-jess-subtle/50 hover:shadow-md transition-all"
          >
            <div className="p-4 bg-gradient-to-r from-jess-subtle/30 to-transparent flex items-center space-x-2">
              {category.icon}
              <h3 className="font-medium text-jess-foreground">{category.name}</h3>
            </div>
            
            <div className="p-4 divide-y divide-jess-subtle/30">
              {category.prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(category, prompt)}
                  className="py-2 w-full text-left text-sm hover:text-jess-primary transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <QuickJournalDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        category={selectedCategory}
        prompt={selectedPrompt}
      />
    </div>
  );
};
