
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';
import { clearCurrentConversationFromStorage } from '@/lib/storageUtils';

/**
 * Hook for managing the current conversation in My Story
 */
export const useStoryConversation = () => {
  const [existingConversationId, setExistingConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchJournalEntries } = useUserData();
  const { toast } = useToast();
  
  const handleBack = async () => {
    if (user) {
      console.log('StoryConversation - Refreshing journal entries before navigating back to dashboard');
      try {
        await fetchJournalEntries();
      } catch (error) {
        console.error('StoryConversation - Error refreshing journal entries:', error);
      }
    }
    navigate('/');
  };

  const handleStartFresh = async () => {
    if (existingConversationId) {
      console.log('StoryConversation - Starting fresh conversation');
      clearCurrentConversationFromStorage('story');
      
      try {
        await fetchJournalEntries();
        toast({
          title: "New Story Started",
          description: "Your previous story was saved and a new conversation has been started.",
        });
      } catch (error) {
        console.error('StoryConversation - Error refreshing journal entries:', error);
      }
      
      setExistingConversationId(null);
      window.location.reload();
    }
  };

  return {
    existingConversationId,
    setExistingConversationId,
    isLoadingConversation,
    setIsLoadingConversation,
    handleBack,
    handleStartFresh
  };
};
