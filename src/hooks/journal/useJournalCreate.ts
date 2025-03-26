
import { useState } from 'react';
import { JournalEntry } from '@/lib/types';
import * as journalService from '@/services/journal';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for creating new journal entries
 */
export function useJournalCreate() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveJournalEntry = async (userId: string, prompt: string, content: string, type = 'journal') => {
    try {
      // Validate that content is not empty
      if (!content.trim()) {
        toast({
          title: "Cannot save empty entry",
          description: "Please add some content to your journal entry",
          variant: "destructive"
        });
        return null;
      }
      
      setLoading(true);
      console.log(`Saving journal entry of type: ${type}`);
      
      // Extract title from content if it's JSON formatted
      let title = prompt.substring(0, 50);
      let entryType = type;
      
      try {
        if (content.includes('{') && content.includes('}')) {
          // Try to extract JSON from content if it has code blocks
          const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
          const match = content.match(jsonRegex);
          const contentToProcess = match && match[1] ? match[1].trim() : content;
          
          // Parse the JSON
          const parsedContent = JSON.parse(contentToProcess);
          
          // Use title from parsed content if available
          if (parsedContent.title) {
            title = parsedContent.title;
          }
          
          // Use type from parsed content if available
          if (parsedContent.type) {
            entryType = parsedContent.type;
          }
        }
      } catch (e) {
        // If JSON parsing fails, use the defaults
        console.log('Failed to parse JSON from content, using default title and type');
      }
      
      const entry = await journalService.saveJournalEntry(userId, prompt, content, entryType);
      
      if (entry) {
        toast({
          title: "Journal entry saved",
          description: "Your entry has been saved successfully",
        });
      }
      
      return entry;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error saving journal entry",
        description: "Please try again later",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveJournalEntry,
  };
}
