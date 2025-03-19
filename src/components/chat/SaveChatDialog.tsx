
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
import { clearCurrentConversationFromStorage } from "@/lib/storageUtils";
import { useUserData } from "@/context/UserDataContext";

interface SaveChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshData?: boolean;
  continuousChat?: boolean;
}

export function SaveChatDialog({ 
  open, 
  onOpenChange, 
  refreshData = false,
  continuousChat = false 
}: SaveChatDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchJournalEntries } = useUserData();

  const handleSave = async () => {
    // Only clear conversation if not in continuous mode
    if (!continuousChat) {
      clearCurrentConversationFromStorage('story');
    }
    
    // If refresh is needed, fetch latest entries before navigating
    if (refreshData) {
      try {
        await fetchJournalEntries();
        console.log("Journal entries refreshed after saving story");
      } catch (error) {
        console.error("Error refreshing journal entries:", error);
      }
    }
    
    toast({
      title: continuousChat ? "Conversation updated" : "Conversation saved",
      description: continuousChat 
        ? "Your story has been updated in your journal. Your conversation will continue next time."
        : "Your story chat has been saved to your journal. A new conversation will begin next time.",
    });
    
    navigate('/dashboard');
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{continuousChat ? "Update your story" : "Save your story chat"}</DialogTitle>
          <DialogDescription>
            {continuousChat 
              ? "Updating your story will add this conversation to your journal and allow you to continue next time."
              : "Saving your chat will add this conversation to your journal and start a fresh conversation next time you return."}
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 my-2 bg-jess-subtle rounded-md">
          <p className="text-sm">
            <span className="font-medium">What happens when you {continuousChat ? "update" : "save"}:</span>
          </p>
          <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
            <li>This conversation is saved to your journal</li>
            <li>A summary is created for easy reference</li>
            {!continuousChat && <li>Your next visit will start a new conversation</li>}
            {continuousChat && <li>Your next visit will continue this conversation</li>}
          </ul>
        </div>
        <DialogFooter className="flex space-x-2 sm:justify-between sm:space-x-0">
          <Button variant="outline" onClick={handleCancel}>
            Keep Chatting
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {continuousChat ? "Update and Exit" : "Save and Exit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
