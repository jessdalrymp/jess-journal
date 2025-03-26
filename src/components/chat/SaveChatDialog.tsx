
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
import { Input } from "@/components/ui/input";

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);
  const [conversationTitle, setConversationTitle] = useState('');

  // Get the current conversation from storage once when dialog opens
  const [currentConversation, setCurrentConversation] = useState(null);
  
  useEffect(() => {
    if (open) {
      setSaveComplete(false);
      setIsSaving(false);
      const conversation = getCurrentConversationFromStorage('story');
      setCurrentConversation(conversation);
      
      // Generate a default title from the first few user messages if available
      if (conversation && conversation.messages && conversation.messages.length > 0) {
        const userMessages = conversation.messages
          .filter(msg => msg.role === 'user')
          .slice(0, 2);
          
        if (userMessages.length > 0) {
          const firstMessage = userMessages[0].content;
          // Create title from first user message (limited to 40 chars)
          const suggestedTitle = firstMessage.length > 40 
            ? firstMessage.substring(0, 40) + '...' 
            : firstMessage;
          setConversationTitle(suggestedTitle);
        } else {
          setConversationTitle(`My Story - ${new Date().toLocaleDateString()}`);
        }
      } else {
        setConversationTitle(`My Story - ${new Date().toLocaleDateString()}`);
      }
    }
  }, [open]);

  // Setup the generate summary hook with the current conversation ID
  const { generateTitleAndSummary, generating } = useGenerateSummary(
    currentConversation?.id || null,
    'story',
    () => {
      // This callback is called when saving is complete
      if (refreshData) {
        fetchJournalEntries();
      }
      
      setSaveComplete(true);
      
      // Delay navigation to ensure toast is seen
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  );

  const handleSave = async () => {
    console.log("Save button clicked in SaveChatDialog");
    if (isSaving || saveComplete) {
      console.log("Already saving or save completed, ignoring duplicate click");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const currentConversation = getCurrentConversationFromStorage('story');
      console.log("Current conversation retrieved:", currentConversation?.id);
      
      if (currentConversation && currentConversation.messages.length > 1) {
        console.log("Saving conversation to journal with title:", conversationTitle);
        
        // Pass the custom title to the generate summary function
        await generateTitleAndSummary(
          currentConversation.messages, 
          conversationTitle
        );
      }
      
      if (!persistConversation) {
        clearCurrentConversationFromStorage('story');
      }
      
      const message = persistConversation 
        ? "Your story has been saved to your journal. You can continue your conversation."
        : "Your story chat has been saved to your journal. A new conversation will begin next time.";
      
      toast({
        title: "Conversation saved",
        description: message,
      });
    } catch (error) {
      console.error("Error saving conversation:", error);
      toast({
        title: "Error saving conversation",
        description: "There was a problem saving your story. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isSaving || saveComplete) {
      console.log("Cannot cancel while saving or after save completed");
      return;
    }
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
        
        <div className="space-y-4 py-3">
          <div className="space-y-2">
            <label htmlFor="conversationTitle" className="text-sm font-medium">
              Conversation Title
            </label>
            <Input 
              id="conversationTitle" 
              value={conversationTitle}
              onChange={(e) => setConversationTitle(e.target.value)}
              placeholder="Enter a title for this conversation"
              className="w-full"
              disabled={isSaving || generating || saveComplete}
            />
          </div>
          
          <div className="p-3 bg-jess-subtle rounded-md">
            <p className="text-sm">
              <span className="font-medium">What happens when you save:</span>
            </p>
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
              <li>This conversation is saved to your journal</li>
              {!persistConversation && <li>Your next visit will start a new conversation</li>}
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 sm:justify-between sm:space-x-0">
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            disabled={isSaving || generating || saveComplete}
          >
            Keep Chatting
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || generating || saveComplete || !conversationTitle.trim()}
            className="bg-jess-primary text-white hover:bg-jess-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {(isSaving || generating) ? "Saving..." : (saveComplete ? "Saved" : "Save and Exit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
