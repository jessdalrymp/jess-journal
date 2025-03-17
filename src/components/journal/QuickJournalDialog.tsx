
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useJournalCreate } from '@/hooks/journal/useJournalCreate';
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
  const { saveJournalEntry } = useJournalCreate();

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
      
      // Save the entry using the journal hook
      await saveJournalEntry(user.id, prompt, journalContent);
      
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
          <DialogDescription className="text-sm mt-2">{prompt}</DialogDescription>
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
