
import React from 'react';
import { ChatEndDialog } from './ChatEndDialog';
import { JournalingDialog } from '../challenges/JournalingDialog';
import { useGenerateSummary } from './hooks/useGenerateSummary';
import { ConversationSession } from '@/lib/types';

interface ChatDialogsProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  showEndDialog: boolean;
  setShowEndDialog: (show: boolean) => void;
  onEndConversation: () => void;
  showJournalingDialog: boolean;
  setShowJournalingDialog: (show: boolean) => void;
  promptText?: string;
  saveChat?: boolean;
  session?: ConversationSession | null;
}

export const ChatDialogs = ({
  type,
  showEndDialog,
  setShowEndDialog,
  onEndConversation,
  showJournalingDialog,
  setShowJournalingDialog,
  promptText,
  saveChat = false,
  session
}: ChatDialogsProps) => {
  const { generateSummary } = useGenerateSummary();

  const handleEndConversation = async () => {
    try {
      console.log("Ending conversation and generating summary...");
      
      // If we should save the chat and have a valid session, generate summary
      if (saveChat && session) {
        const summary = await generateSummary(session);
        console.log("Summary generated:", summary);
      }
      
      // Call the original onEndConversation callback
      onEndConversation();
    } catch (error) {
      console.error("Error in handleEndConversation:", error);
      // Still call onEndConversation even if there's an error
      onEndConversation();
    }
  };

  return (
    <>
      <ChatEndDialog 
        open={showEndDialog} 
        onOpenChange={setShowEndDialog} 
        onEndConversation={handleEndConversation} 
      />
      
      {type === 'journal' && (
        <JournalingDialog
          open={showJournalingDialog}
          onOpenChange={setShowJournalingDialog}
          challengeType="journal"
          promptText={promptText}
        />
      )}
    </>
  );
};
