
import { JournalEntry } from '../lib/types';
import { supabase } from '../integrations/supabase/client';

// Helper function to parse content that might be JSON in a code block
const parseContentWithJsonCodeBlock = (content: string) => {
  try {
    // First, try to detect if this is a JSON string inside code blocks
    let contentToProcess = content;
    
    // Remove code block markers if present
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const match = content.match(jsonRegex);
    if (match && match[1]) {
      contentToProcess = match[1].trim();
    }
    
    // Try to parse as JSON
    const parsed = JSON.parse(contentToProcess);
    return parsed;
  } catch (e) {
    // If parsing fails, return null
    return null;
  }
};

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
      const entries: JournalEntry[] = data.map(entry => {
        // Try to parse the content as JSON
        const parsedContent = parseContentWithJsonCodeBlock(entry.content);
        
        // Use the parsed title if available, otherwise use the prompt
        const title = parsedContent && parsedContent.title 
          ? parsedContent.title 
          : entry.prompt.substring(0, 50) + (entry.prompt.length > 50 ? '...' : '');

        return {
          id: entry.id,
          userId: entry.user_id,
          title: title,
          content: entry.content,
          type: (entry.type as 'journal' | 'story' | 'sideQuest' | 'action') || 'journal',
          createdAt: new Date(entry.created_at)
        };
      });
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
      type: (data.type as 'journal' | 'story' | 'sideQuest' | 'action') || 'journal',
      createdAt: new Date(data.created_at)
    };

    return newEntry;
  } catch (error) {
    console.error('Error processing journal entry:', error);
    return null;
  }
};

export const updateJournalEntry = async (entryId: string, content: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .update({ content })
      .eq('id', entryId);

    if (error) {
      console.error('Error updating journal entry:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return false;
  }
};

export const deleteJournalEntry = async (entryId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Error deleting journal entry:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return false;
  }
};
