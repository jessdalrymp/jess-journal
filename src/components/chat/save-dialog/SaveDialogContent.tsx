
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SaveDialogContentProps {
  conversationTitle: string;
  setConversationTitle: (title: string) => void;
  isSaving: boolean;
  generating: boolean;
  saveComplete: boolean;
  persistConversation: boolean;
  handleSave: () => void;
  handleCancel: () => void;
}

export function SaveDialogContent({
  conversationTitle,
  setConversationTitle,
  isSaving,
  generating,
  saveComplete,
  persistConversation,
  handleSave,
  handleCancel
}: SaveDialogContentProps) {
  return (
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
            <li>You will be redirected to the dashboard</li>
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
  );
}
