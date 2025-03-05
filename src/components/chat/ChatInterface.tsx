
import React, { useEffect, useState } from 'react';
import { useChat } from './useChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ActionButton } from '../ui/ActionButton';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
}

export const ChatInterface = ({ type, onBack }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const { session, loading, error, sendMessage, generateSummary } = useChat(type);
  const navigate = useNavigate();
  const [showEndDialog, setShowEndDialog] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // If authentication error is detected, log it for debugging
    if (error && error.includes('authentication')) {
      console.log('Authentication error detected in ChatInterface:', error);
    }
  }, [error]);

  // Handle leaving the chat
  const handleBack = async () => {
    onBack();
  };

  // Show confirmation dialog for ending conversation
  const openEndDialog = () => {
    setShowEndDialog(true);
  };

  // Handle ending the conversation and generating summary
  const handleEndConversation = async () => {
    setShowEndDialog(false);
    
    if (type === 'story' && session && session.messages.length > 2) {
      try {
        toast({
          title: "Saving conversation...",
          description: "We're storing your progress so you can continue later.",
        });
        await generateSummary();
      } catch (error) {
        console.error('Error generating summary:', error);
        toast({
          title: "Error saving conversation",
          description: "There was a problem saving your progress.",
          variant: "destructive"
        });
      }
    }
    
    onBack();
  };

  // If user is not authenticated, show a sign-in prompt
  if (!user) {
    return (
      <div className="h-full flex flex-col">
        <ChatHeader type={type} onBack={onBack} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Sign In Required</h3>
            <p className="text-gray-500 mb-4">Please sign in to access this feature.</p>
            <Button onClick={() => navigate('/', { state: { openAuth: true } })} size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (loading && !session) {
    return (
      <div className="h-full flex flex-col">
        <ChatHeader type={type} onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Loading conversation...
          </div>
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="h-full flex flex-col">
        <ChatHeader type={type} onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-red-500 mb-2">Unable to load conversation</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button onClick={onBack} size="sm" variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // In case session is still null but we're not loading or have an error
  if (!session) {
    return (
      <div className="h-full flex flex-col">
        <ChatHeader type={type} onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-gray-500">Initializing conversation...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader type={type} onBack={handleBack} />
      <div className="flex-1 relative">
        <ChatMessageList messages={session.messages || []} />
        {loading && (
          <div className="px-4 py-2 bg-gray-100 border-t border-jess-subtle flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
            <span className="text-sm font-medium">Jess is thinking...</span>
          </div>
        )}
        <div className="absolute bottom-4 right-4">
          <ActionButton 
            onClick={openEndDialog}
            type="primary"
            className="shadow-md px-6 py-3 text-base"
            icon={<Save className="h-5 w-5" />}
          >
            End Conversation
          </ActionButton>
        </div>
      </div>
      <ChatInput onSendMessage={sendMessage} loading={loading} />

      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>End Conversation</DialogTitle>
            <DialogDescription>
              Good job today, we can join this conversation again next time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>
              Continue Chatting
            </Button>
            <Button onClick={handleEndConversation}>
              End For Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
