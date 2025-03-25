
import React from 'react';
import { ChatEndDialog } from './ChatEndDialog';
import { JournalingDialog } from '../challenges/JournalingDialog';
import { SaveChatDialog } from './SaveChatDialog';

interface ChatDialogsProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  showEndDialog: boolean;
  setShowEndDialog: (show: boolean) => void;
  onEndConversation: () => void;
  showJournalingDialog: boolean;
  setShowJournalingDialog: (show: boolean) => void;
  promptText?: string;
  saveChat?: boolean;
  persistConversation?: boolean;
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
  persistConversation = false
}: ChatDialogsProps) => {
  return (
    <>
      {type === 'story' && saveChat ? (
        <SaveChatDialog 
          open={showEndDialog} 
          onOpenChange={setShowEndDialog} 
          refreshData={true}
          persistConversation={persistConversation}
          onSave={() => onEndConversation()}
        />
      ) : (
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
