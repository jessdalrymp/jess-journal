
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ChatEndDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEndConversation: () => void;
}

export const ChatEndDialog = ({ open, onOpenChange, onEndConversation }: ChatEndDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>End Conversation</DialogTitle>
          <DialogDescription>
            Good job today, we can join this conversation again next time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Continue Chatting
          </Button>
          <Button onClick={onEndConversation}>
            End For Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
