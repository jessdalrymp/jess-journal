
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { saveJournalEntryFromConversation } from "@/services/conversation/journalIntegration";

interface JournalingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeType: 'action' | 'journal';
  promptText?: string;
}

export const JournalingDialog = ({
  open,
  onOpenChange,
  challengeType,
  promptText
}: JournalingDialogProps) => {
  const [journalContent, setJournalContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Start the timer when the dialog opens
  useEffect(() => {
    let interval: number;
    
    if (open && timerActive) {
      interval = window.setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [open, timerActive]);

  useEffect(() => {
    if (open) {
      setTimerActive(true);
    } else {
      setTimerActive(false);
      setTimeSpent(0);
    }
  }, [open]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSaveAndClose = async () => {
    if (!user || !journalContent.trim()) return;
    
    try {
      setIsSaving(true);
      
      // Format the journal content as JSON
      const jsonContent = JSON.stringify({
        title: `${challengeType === 'action' ? 'Action' : 'Journal'} Challenge Reflection`,
        summary: journalContent.trim(),
        timeSpent: timeSpent,
        prompt: promptText || ""
      }, null, 2);
      
      const formattedContent = `\`\`\`json\n${jsonContent}\n\`\`\``;
      
      // Save to journal entries
      await saveJournalEntryFromConversation(
        user.id, 
        promptText || `${challengeType === 'action' ? 'Action' : 'Journal'} Challenge Reflection`, 
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-white rounded-lg border border-jess-subtle">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-4 font-cormorant">Write Your Journal Entry</DialogTitle>
        </DialogHeader>
        
        {promptText && (
          <div className="bg-jess-subtle p-4 rounded-md mb-4">
            <p className="italic font-medium text-gray-700">{promptText}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-2 text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">Time spent: {formatTime(timeSpent)}</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto mb-4 min-h-[200px]" style={{ maxHeight: 'calc(60vh - 200px)' }}>
          <Textarea
            placeholder="Write about your thoughts, feelings, and insights related to this prompt. Let your ideas flow freely."
            className="min-h-[200px] h-full p-4 text-base resize-none border-jess-subtle focus-visible:ring-jess-primary"
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            style={{ height: '100%', overflow: 'auto' }}
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
            className="bg-jess-primary text-white hover:bg-jess-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Save & View History
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
