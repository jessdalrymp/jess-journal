
import { useState } from 'react';
import { JournalEntry } from '../lib/types';
import { getJournalEntriesFromStorage, saveJournalEntriesToStorage } from '../lib/storageUtils';

export const useJournalEntries = (userId: string | undefined) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const loadJournalEntries = () => {
    if (!userId) {
      setJournalEntries([]);
      return;
    }

    try {
      const storedEntries = getJournalEntriesFromStorage();
      setJournalEntries(storedEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>) => {
    if (!userId) throw new Error('User not authenticated');
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      userId,
      createdAt: new Date(),
      ...entry,
    };
    
    const updatedEntries = [...journalEntries, newEntry];
    saveJournalEntriesToStorage(updatedEntries);
    setJournalEntries(updatedEntries);
    
    return newEntry;
  };

  return {
    journalEntries,
    loadJournalEntries,
    addJournalEntry
  };
};
