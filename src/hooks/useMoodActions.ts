
import { useState } from 'react';
import { MoodType, MoodEntry } from '../lib/types';
import { useToast } from '@/hooks/use-toast';
import * as moodService from '../services/moodService';

export function useMoodActions() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMoodEntries = async (userId: string) => {
    try {
      const entries = await moodService.fetchMoodEntries(userId);
      return entries;
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      return [];
    }
  };

  const addMoodEntry = async (userId: string, mood: MoodType, note?: string) => {
    try {
      const newEntry = await moodService.addMoodEntry(userId, mood, note);
      if (newEntry) {
        toast({
          title: "Mood saved",
          description: "Your mood has been recorded.",
        });
      }
      return newEntry;
    } catch (error) {
      console.error('Error adding mood entry:', error);
      toast({
        title: "Error saving mood",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    loading,
    fetchMoodEntries,
    addMoodEntry,
  };
}
