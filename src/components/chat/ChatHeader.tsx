
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatFooter } from './ChatFooter';

interface ChatHeaderProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
  onEndChat?: () => void;
  onAcceptChallenge?: () => void;
  onNewChallenge?: () => void;
  saveChat?: boolean;
}

export const ChatHeader = ({ 
  type, 
  onBack, 
  onEndChat, 
  onAcceptChallenge,
  onNewChallenge,
  saveChat = false
}: ChatHeaderProps) => {
  const getTypeTitle = () => {
    switch (type) {
      case 'story': return 'My Story';
      case 'sideQuest': return 'Side Quest';
      case 'action': return 'Action Challenge';
      case 'journal': return 'Journal';
      default: return 'Chat';
    }
  };

  return (
    <div className="sticky top-0 z-10">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <Button onClick={onBack} variant="ghost" size="sm" className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Button>
          <h2 className="text-lg font-medium">{getTypeTitle()}</h2>
        </div>
      </div>
      {onEndChat && (
        <div className="hidden">
          <ChatFooter 
            type={type} 
            onEndChat={onEndChat} 
            onAcceptChallenge={onAcceptChallenge}
            onNewChallenge={onNewChallenge}
            saveChat={saveChat}
          />
        </div>
      )}
    </div>
  );
};
