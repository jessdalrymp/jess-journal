
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clearCurrentConversationFromStorage, getCurrentConversationFromStorage } from "@/lib/storageUtils";
import { useUserData } from "@/context/UserDataContext";
import { useGenerateSummary } from "./hooks/useGenerateSummary";
import { useState } from "react";

interface SaveChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (refreshData: boolean) => void;
  refreshData?: boolean;
  persistConversation?: boolean;
}

export function SaveChatDialog({ 
  open, 
  onOpenChange, 
  onSave,
  refreshData = false,
  persistConversation = false
}: SaveChatDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchJournalEntries } = useUserData();
  const { generateSummary, loading: summaryLoading } = useGenerateSummary();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get the current conversation from storage
      const currentConversation = getCurrentConversationFromStorage('story');
      
      if (currentConversation && currentConversation.messages.length > 1) {
        console.log("Generating summary for story conversation before saving...");
        // Generate summary to save to journal
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
      } else {
        console.warn("No conversation or empty conversation found to save");
      }
      
      // Only clear current conversation if not persisting
      if (!persistConversation) {
        clearCurrentConversationFromStorage('story');
      }
      
      // If refresh is needed, fetch latest entries before navigating
      if (refreshData) {
        try {
          console.log("Refreshing journal entries after saving story");
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

      // If there's a callback function for saving, call it
      if (onSave) {
        console.log("Calling onSave callback with refreshData:", refreshData);
        onSave(refreshData);
      } else {
        console.log("No onSave callback provided, navigating to dashboard directly");
        // Add a slight delay to ensure toast is shown
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      }
    } catch (error) {
      console.error("Error saving conversation:", error);
      toast({
        title: "Error saving conversation",
        description: "There was a problem saving your story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      // Only close the dialog if there's no custom onSave handler
      if (!onSave) {
        onOpenChange(false);
      }
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={handleCancel} disabled={isSaving || summaryLoading}>
            Keep Chatting
          </Button>
          <Button onClick={handleSave} disabled={isSaving || summaryLoading}>
            <Save className="w-4 h-4 mr-2" />
            {(isSaving || summaryLoading) ? "Saving..." : "Save and Exit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
