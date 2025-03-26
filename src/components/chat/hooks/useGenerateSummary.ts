
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import * as conversationService from '@/services/conversation';
import { useToast } from '@/hooks/use-toast';

export const useGenerateSummary = (
  conversationId: string | null,
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  onSummarySaved?: () => void
) => {
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateTitleAndSummary = useCallback(async (messages: { role: string; content: string }[]) => {
    if (!user || !conversationId) {
      console.error("User not authenticated or conversation ID missing");
      return;
    }

    setGenerating(true);
    try {
      // Just use a simple title based on conversation type
      const generatedTitle = `My ${type.charAt(0).toUpperCase() + type.slice(1)} Conversation`;
      
      // Save conversation title
      await conversationService.updateConversationTitle(conversationId, generatedTitle);
      
      // Save to journal if it's a story, sideQuest, or action
      if (type === 'story' || type === 'sideQuest' || type === 'action') {
        // Just pass the conversation to journal without summary
        await conversationService.saveConversationToJournal(
          user.id,
          generatedTitle,
          conversationId,
          type
        );
      }

      if (onSummarySaved) {
        onSummarySaved();
      }

      toast({
        title: "Conversation Saved",
        description: "Your conversation has been saved to your journal.",
      });
    } catch (error: any) {
      console.error("Error saving conversation:", error);
      toast({
        title: "Error Saving Conversation",
        description: "There was an error saving your conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }, [conversationId, user, type, onSummarySaved, toast]);

  return { generateTitleAndSummary, generating };
};
