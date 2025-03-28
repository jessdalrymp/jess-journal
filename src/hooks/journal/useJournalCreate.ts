
import { useState } from 'react';
import { JournalEntry } from '@/lib/types';
import * as journalService from '@/services/journal';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for creating new journal entries
 */
export function useJournalCreate() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveJournalEntry = async (userId: string, prompt: string, content: string, type = 'journal') => {
    try {
      // Validate input data before proceeding
      if (!userId) {
        toast({
          title: "Error saving journal entry",
          description: "User ID is required",
          variant: "destructive"
        });
        return null;
      }
      
      // Trim content and check if it's empty after trimming
      const trimmedContent = content.trim();
      if (!trimmedContent) {
        toast({
          title: "Cannot save empty entry",
          description: "Please add some content to your journal entry",
          variant: "destructive"
        });
        return null;
      }
      
      // Trim prompt
      const trimmedPrompt = prompt.trim() || "Untitled Entry";
      
      setLoading(true);
      console.log(`Saving journal entry of type: ${type}`);
      
      // Extract title from content if it's JSON formatted
      let title = trimmedPrompt.substring(0, 50);
      let entryType = type;
      
      try {
        if (trimmedContent.includes('{') && trimmedContent.includes('}')) {
          // Try to extract JSON from content if it has code blocks
          const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
          const match = trimmedContent.match(jsonRegex);
          const contentToProcess = match && match[1] ? match[1].trim() : trimmedContent;
          
          // Parse the JSON
          const parsedContent = JSON.parse(contentToProcess);
          
          // Use title from parsed content if available
          if (parsedContent.title && parsedContent.title.trim()) {
            title = parsedContent.title.trim();
          }
          
          // Use type from parsed content if available
          if (parsedContent.type && parsedContent.type.trim()) {
            entryType = parsedContent.type.trim();
          }
        }
      } catch (e) {
        // If JSON parsing fails, use the defaults
        console.log('Failed to parse JSON from content, using default title and type');
      }
      
      const entry = await journalService.saveJournalEntry(userId, trimmedPrompt, trimmedContent, entryType);
      
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
