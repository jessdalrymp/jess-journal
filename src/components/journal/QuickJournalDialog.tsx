
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PromptCategory, Prompt } from './data/promptCategories';

interface QuickJournalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: PromptCategory | null;
  prompt: Prompt | null;
}

export const QuickJournalDialog = ({ isOpen, onClose, category, prompt }: QuickJournalDialogProps) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { fetchJournalEntries } = useUserData();
  const { toast } = useToast();
  
  const handleSave = async () => {
    const trimmedContent = content.trim();
    if (!user || !trimmedContent || !prompt || !category) {
      if (!trimmedContent && user) {
        toast({
          title: "Cannot save empty entry",
          description: "Please write something before saving.",
          variant: "destructive"
        });
      }
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Generate a title based on the user's response, not the prompt
      const contentPreview = trimmedContent.substring(0, 40) + (trimmedContent.length > 40 ? '...' : '');
      const entryTitle = `${category.name}: ${contentPreview}`;
      
      const journalContent = JSON.stringify({
        title: entryTitle,
        prompt: prompt, // Store the original prompt for reference
        summary: trimmedContent,
        type: category.id
      });
      
      // Import these dynamically to reduce initial load time
      const journalCreateModule = await import('@/hooks/journal/useJournalCreate');
      const { saveJournalEntry } = journalCreateModule.useJournalCreate();
      
      await saveJournalEntry(user.id, entryTitle, journalContent);
      
      fetchJournalEntries();
      
      toast({
        title: "Journal entry saved",
        description: `Your ${category.name.toLowerCase()} has been saved successfully.`,
      });
      
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
          <DialogDescription>{prompt}</DialogDescription>
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
