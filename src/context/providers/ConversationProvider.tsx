
import React, { createContext, useContext } from 'react';
import { User, ConversationSession } from '../../lib/types';
import { useConversationData } from '../../hooks/useConversationData';
import { useToast } from '@/hooks/use-toast';
import { useJournal } from './JournalProvider';

interface ConversationContextType {
  loading: boolean;
  startConversation: (type: 'story' | 'sideQuest' | 'action' | 'journal') => Promise<ConversationSession>;
  addMessageToConversation: (conversationId: string, content: string, role: 'user' | 'assistant') => Promise<void>;
}

export const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

interface ConversationProviderProps {
  user: User | null;
  children: React.ReactNode;
}

export const ConversationProvider: React.FC<ConversationProviderProps> = ({ user, children }) => {
  const { loading: conversationLoading, startConversation, addMessageToConversation: addMessage } = useConversationData(user?.id);
  const { fetchJournalEntries } = useJournal();
  const { toast } = useToast();

  const handleAddMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<void> => {
    try {
      await addMessage(conversationId, content, role);
      
      if (role === 'assistant') {
        if (user) {
          await fetchJournalEntries();
        }
      }
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      toast({
        title: "Error saving message",
        description: "Your message might not have been saved",
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    loading: conversationLoading,
    startConversation,
    addMessageToConversation: handleAddMessageToConversation
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};
