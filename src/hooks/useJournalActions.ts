
import { useState } from 'react';
import { JournalEntry } from '../lib/types';
import * as journalService from '../services/journalService';

export function useJournalActions() {
  const [loading, setLoading] = useState(false);

  const fetchJournalEntries = async (userId: string) => {
    try {
      setLoading(true);
      const entries = await journalService.fetchJournalEntries(userId);
      return entries;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchJournalEntries,
  };
}
