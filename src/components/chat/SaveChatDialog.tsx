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
import { useUserData } from "@/context/UserDataContext";

interface SaveChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshData?: boolean;
  keepConversation?: boolean;
}

export function SaveChatDialog({ 
  open, 
  onOpenChange, 
  refreshData = false,
  keepConversation = true // Default to keeping the conversation
}: SaveChatDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchJournalEntries } = useUserData();

  const handleSave = async () => {
    // Only clear current conversation if keepConversation is false
    // No need to clear conversation storage if we want to keep using it
    
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
      title: "Conversation saved",
      description: keepConversation 
        ? "Your story chat has been saved to your journal." 
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
          <DialogTitle>Save your story chat</DialogTitle>
          <DialogDescription>
            Saving your chat will add this conversation to your journal history.
            {!keepConversation && " A fresh conversation will start next time you return."}
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 my-2 bg-jess-subtle rounded-md">
          <p className="text-sm">
            <span className="font-medium">What happens when you save:</span>
          </p>
          <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
            <li>This conversation is saved to your journal</li>
            <li>A summary is created for easy reference</li>
            {!keepConversation && <li>Your next visit will start a new conversation</li>}
          </ul>
        </div>
        <DialogFooter className="flex space-x-2 sm:justify-between sm:space-x-0">
          <Button variant="outline" onClick={handleCancel}>
            Keep Chatting
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save and Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
