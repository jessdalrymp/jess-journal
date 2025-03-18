
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PromptCategory, Prompt } from './data/promptCategories';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickJournalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: PromptCategory | null;
  prompt: Prompt | null;
}

export const QuickJournalDialog = ({ isOpen, onClose, category, prompt }: QuickJournalDialogProps) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const { user } = useAuth();
  const { fetchJournalEntries } = useUserData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!user || !content.trim() || !prompt || !category) return;
    
    setIsSaving(true);
    
    try {
      // Format content as the title, not the prompt question
      const contentPreview = content.trim().substring(0, 40) + (content.length > 40 ? '...' : '');
      // Create a title that shows this is a response, not the question
      const entryTitle = `${category.name}: ${contentPreview}`;
      
      const journalContent = JSON.stringify({
        title: entryTitle,
        prompt: prompt.text, // Store the original prompt for reference
        summary: content,
        type: category.id
      });
      
      // Import these dynamically to reduce initial load time
      const journalCreateModule = await import('@/hooks/journal/useJournalCreate');
      const { saveJournalEntry } = journalCreateModule.useJournalCreate();
      
      const savedEntry = await saveJournalEntry(user.id, prompt.text, journalContent);
      
      if (savedEntry) {
        setSavedEntryId(savedEntry.id);
        
        // Refresh journal entries list to ensure the new entry is available
        await fetchJournalEntries(true);
        
        toast({
          title: "Journal entry saved",
          description: `Your ${category.name.toLowerCase()} has been saved successfully.`,
        });
        
        // Clear the content
        setContent('');
        
        // Close the dialog
        onClose();
        
        // Navigate to the new entry
        setTimeout(() => {
          navigate(`/journal-entry/${savedEntry.id}`, {
            state: { entry: savedEntry }
          });
        }, 300);
      } else {
        throw new Error("Failed to save entry");
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error saving entry",
        description: "Something went wrong. Please try again or check your network connection.",
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
          <DialogDescription>{prompt?.text}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="min-h-[200px]"
            disabled={isSaving}
          />
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!content.trim() || isSaving}
              className="relative"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Entry"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
