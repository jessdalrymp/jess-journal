
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatHeader } from './ChatHeader';
import { Button } from '@/components/ui/button';

interface ChatUnauthenticatedStateProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
}

export const ChatUnauthenticatedState = ({ type, onBack }: ChatUnauthenticatedStateProps) => {
  const navigate = useNavigate();

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
};
