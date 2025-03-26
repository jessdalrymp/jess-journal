import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import * as conversationService from '@/services/conversation';
import { useToast } from '@/hooks/use-toast';

interface SummaryResult {
  title: string | null;
  summary: string | null;
}

export const useGenerateSummary = (
  conversationId: string | null,
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  onSummarySaved?: () => void
) => {
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState<SummaryResult>({ title: null, summary: null });
  const { user } = useAuth();
  const { toast } = useToast();

  const generateTitleAndSummary = useCallback(async (messages: { role: string; content: string }[]) => {
    if (!user || !conversationId) {
      console.error("User not authenticated or conversation ID missing");
      return;
    }

    setGenerating(true);
    try {
      // Step 1: Generate Title
      const titleResponse = await fetch('/api/generate-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!titleResponse.ok) {
        throw new Error(`Title generation failed with status: ${titleResponse.status}`);
      }

      const titleData = await titleResponse.json();
      const generatedTitle = titleData.title?.trim() || 'Untitled';

      // Step 2: Generate Summary
      const summaryResponse = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!summaryResponse.ok) {
        throw new Error(`Summary generation failed with status: ${summaryResponse.status}`);
      }

      const summaryData = await summaryResponse.json();
      const generatedSummary = summaryData.summary?.trim() || '';

      setSummary({ title: generatedTitle, summary: generatedSummary });

      // Step 3: Save Title and Summary to Database
      if (user && conversationId) {
        try {
          await conversationService.updateConversationTitle(conversationId, generatedTitle);
          await conversationService.updateConversationSummary(conversationId, generatedSummary);

          // Also save to journal if it's a story, sideQuest, or action
          if (type === 'story' || type === 'sideQuest' || type === 'action') {
            await conversationService.saveConversationSummary(
              user.id,
              generatedTitle,
              generatedSummary,
              conversationId,
              type
            );
          }

          if (onSummarySaved) {
            onSummarySaved();
          }

          toast({
            title: "Summary Generated",
            description: "Your story has been summarized and saved.",
          });
        } catch (dbError: any) {
          console.error("Error saving summary to database:", dbError);
          toast({
            title: "Error Saving Summary",
            description: "There was an error saving the summary. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Error generating title and summary:", error);
      toast({
        title: "Error Generating Summary",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }, [conversationId, user, type, onSummarySaved, toast]);

  return { generateTitleAndSummary, generating, summary };
};
