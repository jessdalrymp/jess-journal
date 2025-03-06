
import { useState, useRef } from 'react';
import { JournalEntry } from '../lib/types';
import * as journalService from '../services/journalService';
import { useToast } from '@/components/ui/use-toast';

export function useJournalActions() {
  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);
  const { toast } = useToast();

  const fetchJournalEntries = async (userId: string) => {
    // Prevent multiple simultaneous fetches
    if (isFetching.current) {
      console.log('Already fetching journal entries, skipping duplicate request');
      return [];
    }
    
    try {
      setLoading(true);
      isFetching.current = true;
      console.log('Fetching journal entries for user:', userId);
      const entries = await journalService.fetchJournalEntries(userId);
      console.log(`Successfully fetched ${entries.length} journal entries`);
      return entries;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast({
        title: "Error loading journal entries",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const saveJournalEntry = async (userId: string, prompt: string, content: string) => {
    try {
      setLoading(true);
      const entry = await journalService.saveJournalEntry(userId, prompt, content);
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
    fetchJournalEntries,
    saveJournalEntry,
  };
}
