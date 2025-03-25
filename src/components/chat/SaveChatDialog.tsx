import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clearCurrentConversationFromStorage, getCurrentConversationFromStorage } from "@/lib/storageUtils";
import { useUserData } from "@/context/UserDataContext";
import { useGenerateSummary } from "./hooks/useGenerateSummary";
import { useState, useEffect } from "react";

interface SaveChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshData?: boolean;
  persistConversation?: boolean;
}

export function SaveChatDialog({ 
  open, 
  onOpenChange, 
  refreshData = false,
  persistConversation = false
}: SaveChatDialogProps) {
  const { toast } = useToast();
  const { fetchJournalEntries } = useUserData();
  const { generateSummary, loading: summaryLoading } = useGenerateSummary();
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);

  useEffect(() => {
    if (open) {
      setSaveComplete(false);
    }
  }, [open]);

  const handleSave = async () => {
    console.log("Save button clicked in SaveChatDialog");
    setIsSaving(true);
    try {
      const currentConversation = getCurrentConversationFromStorage('story');
      
      if (currentConversation && currentConversation.messages.length > 1) {
        console.log("Generating summary for story conversation before saving...");
        await generateSummary({
          id: currentConversation.id,
          userId: currentConversation.userId,
          type: 'story',
          title: currentConversation.title || 'My Story',
          messages: currentConversation.messages,
          createdAt: new Date(currentConversation.createdAt),
          updatedAt: new Date(currentConversation.updatedAt),
        });
        
        console.log("Story conversation summarized and saved to journal");
      }
      
      if (!persistConversation) {
        clearCurrentConversationFromStorage('story');
      }
      
      if (refreshData) {
        try {
          await fetchJournalEntries();
          console.log("Journal entries refreshed after saving story");
        } catch (error) {
          console.error("Error refreshing journal entries:", error);
        }
      }
      
      const message = persistConversation 
        ? "Your story has been saved to your journal. You can continue your conversation."
        : "Your story chat has been saved to your journal. A new conversation will begin next time.";
      
      toast({
        title: "Conversation saved",
        description: message,
      });
      
      setSaveComplete(true);
      
      console.log("Preparing to navigate to dashboard after saving story");
      setTimeout(() => {
        console.log("Navigating to dashboard after save");
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      console.error("Error saving conversation:", error);
      toast({
        title: "Error saving conversation",
        description: "There was a problem saving your story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      if (!saveComplete) {
        onOpenChange(false);
      }
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSaving && !saveComplete) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save your story chat</DialogTitle>
          <DialogDescription>
            {persistConversation 
              ? "Saving your chat will add this conversation to your journal while keeping your current conversation." 
              : "Saving your chat will add this conversation to your journal and start a fresh conversation next time you return."}
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 my-2 bg-jess-subtle rounded-md">
          <p className="text-sm">
            <span className="font-medium">What happens when you save:</span>
          </p>
          <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
            <li>This conversation is saved to your journal</li>
            <li>A summary is created for easy reference</li>
            {!persistConversation && <li>Your next visit will start a new conversation</li>}
          </ul>
        </div>
        <DialogFooter className="flex space-x-2 sm:justify-between sm:space-x-0">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving || summaryLoading || saveComplete}>
            Keep Chatting
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || summaryLoading || saveComplete}
            className="bg-jess-primary text-white hover:bg-jess-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {(isSaving || summaryLoading) ? "Saving..." : (saveComplete ? "Saved" : "Save and Exit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
