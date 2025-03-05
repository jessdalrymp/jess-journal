
import { useState } from 'react';
import { MoodEntry, MoodType } from '../lib/types';
import { getMoodEntriesFromStorage, saveMoodEntriesToStorage } from '../lib/storageUtils';

export const useMoodEntries = (userId: string | undefined) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const loadMoodEntries = () => {
    if (!userId) {
      setMoodEntries([]);
      return;
    }

    try {
      const storedEntries = getMoodEntriesFromStorage();
      setMoodEntries(storedEntries);
    } catch (error) {
      console.error('Error loading mood entries:', error);
    }
  };

  const addMoodEntry = async (mood: MoodType, note?: string) => {
    if (!userId) throw new Error('User not authenticated');
    
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      userId,
      mood,
      note,
      createdAt: new Date(),
    };
    
    const updatedEntries = [...moodEntries, newEntry];
    saveMoodEntriesToStorage(updatedEntries);
    setMoodEntries(updatedEntries);
    
    return newEntry;
  };

  return {
    moodEntries,
    loadMoodEntries,
    addMoodEntry
  };
};
