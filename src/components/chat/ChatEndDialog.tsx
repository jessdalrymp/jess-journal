
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatEndDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcceptChallenge?: () => void;
  chatType: 'story' | 'sideQuest' | 'action' | 'journal';
}

export function ChatEndDialog({ 
  open, 
  onOpenChange, 
  onAcceptChallenge,
  chatType
}: ChatEndDialogProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    onOpenChange(false);
    // Navigate to the home page
    navigate('/');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>End Conversation</DialogTitle>
          <DialogDescription>
            {chatType === 'action'
              ? "Would you like to accept this challenge or return to dashboard?"
              : "Would you like to return to the dashboard?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          {chatType === 'action' && onAcceptChallenge && (
            <Button 
              variant="default" 
              onClick={() => {
                onAcceptChallenge();
                onOpenChange(false);
              }}
              className="mb-2 sm:mb-0"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Accept Challenge
            </Button>
          )}
          <Button onClick={handleClose} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
