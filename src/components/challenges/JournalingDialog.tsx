
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { saveJournalEntryFromConversation } from "@/services/conversation/journalIntegration";

interface JournalingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeType: 'action' | 'journal';
}

export const JournalingDialog = ({
  open,
  onOpenChange,
  challengeType,
}: JournalingDialogProps) => {
  const [journalContent, setJournalContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveAndClose = async () => {
    if (!user || !journalContent.trim()) return;
    
    try {
      setIsSaving(true);
      
      // Format the journal content as JSON
      const jsonContent = JSON.stringify({
        title: `${challengeType === 'action' ? 'Action' : 'Journal'} Challenge Reflection`,
        summary: journalContent.trim()
      }, null, 2);
      
      const formattedContent = `\`\`\`json\n${jsonContent}\n\`\`\``;
      
      // Save to journal entries
      await saveJournalEntryFromConversation(
        user.id, 
        `${challengeType === 'action' ? 'Action' : 'Journal'} Challenge Reflection`, 
        formattedContent,
        challengeType
      );
      
      toast({
        title: "Journal saved",
        description: "Your reflection has been saved to your journal history.",
      });
      
      // Close dialog and redirect
      onOpenChange(false);
      navigate('/journal-history');
    } catch (error) {
      console.error('Error saving journal:', error);
      toast({
        title: "Error saving journal",
        description: "There was a problem saving your reflection.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (journalContent.trim()) {
      if (confirm("Are you sure you want to discard your journal entry?")) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-4">Reflect on Your Experience</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto min-h-[300px] mb-4">
          <Textarea
            placeholder="Write about your experience with the challenge. What did you notice? How did it feel? What insights did you gain?"
            className="min-h-[300px] p-4 text-base"
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAndClose} 
            disabled={!journalContent.trim() || isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            Save & Close Challenge
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
