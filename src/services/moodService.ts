
import { MoodType, MoodEntry } from '../lib/types';
import { supabase } from '../integrations/supabase/client';

export const fetchMoodEntries = async (userId: string | undefined): Promise<MoodEntry[]> => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching mood entries:', error);
      return [];
    }

    if (data) {
      const entries: MoodEntry[] = data.map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        mood: entry.mood as MoodType,
        note: entry.note || undefined,
        createdAt: new Date(entry.created_at)
      }));
      return entries;
    }
    
    return [];
  } catch (error) {
    console.error('Error processing mood entries:', error);
    return [];
  }
};

export const addMoodEntry = async (userId: string | undefined, mood: MoodType, note?: string): Promise<MoodEntry | null> => {
  if (!userId) {
    return null;
  }

  try {
    const newEntry = {
      user_id: userId,
      mood,
      note
    };

    const { data, error } = await supabase
      .from('mood_entries')
      .insert(newEntry)
      .select()
      .single();

    if (error) {
      console.error('Error adding mood entry:', error);
      throw error;
    }

    const newMoodEntry: MoodEntry = {
      id: data.id,
      userId: data.user_id,
      mood: data.mood as MoodType,
      note: data.note || undefined,
      createdAt: new Date(data.created_at)
    };

    return newMoodEntry;
  } catch (error) {
    console.error('Error processing mood entry:', error);
    throw error;
  }
};
