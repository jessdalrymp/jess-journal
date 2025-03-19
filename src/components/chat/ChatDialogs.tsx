
import React from 'react';
import { ChatEndDialog } from './ChatEndDialog';
import { JournalingDialog } from '../challenges/JournalingDialog';

interface ChatDialogsProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  showEndDialog: boolean;
  setShowEndDialog: (show: boolean) => void;
  onEndConversation: () => void;
  showJournalingDialog: boolean;
  setShowJournalingDialog: (show: boolean) => void;
  promptText?: string;
  saveChat?: boolean;
  continuousChat?: boolean;
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
  continuousChat = false
}: ChatDialogsProps) => {
  return (
    <>
      {(!saveChat || !continuousChat) && (
        <ChatEndDialog 
          open={showEndDialog} 
          onOpenChange={setShowEndDialog} 
          onEndConversation={onEndConversation} 
        />
      )}
      
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
