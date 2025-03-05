
import { JournalEntry } from '../lib/types';
import { supabase } from '../integrations/supabase/client';

export const fetchJournalEntries = async (userId: string | undefined): Promise<JournalEntry[]> => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }

    if (data) {
      const entries: JournalEntry[] = data.map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        title: entry.prompt.substring(0, 50) + (entry.prompt.length > 50 ? '...' : ''),
        content: entry.content,
        type: entry.type || 'journal',
        createdAt: new Date(entry.created_at)
      }));
      return entries;
    }
    
    return [];
  } catch (error) {
    console.error('Error processing journal entries:', error);
    return [];
  }
};

export const saveJournalEntry = async (userId: string | undefined, prompt: string, content: string): Promise<JournalEntry | null> => {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt,
        content,
        type: 'journal'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving journal entry:', error);
      return null;
    }

    const newEntry: JournalEntry = {
      id: data.id,
      userId: data.user_id,
      title: data.prompt.substring(0, 50) + (data.prompt.length > 50 ? '...' : ''),
      content: data.content,
      type: data.type || 'journal',
      createdAt: new Date(data.created_at)
    };

    return newEntry;
  } catch (error) {
    console.error('Error processing journal entry:', error);
    return null;
  }
};
