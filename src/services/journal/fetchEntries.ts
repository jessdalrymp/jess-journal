
import { JournalEntry } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEntryToJournalEntry } from './entryMapper';

/**
 * Fetches all journal entries for a user
 */
export const fetchJournalEntries = async (userId: string | undefined): Promise<JournalEntry[]> => {
  if (!userId) return [];

  try {
    console.log('Fetching journal entries for user:', userId);
    
    // Fetch all journal entries
    const { data: entriesData, error: entriesError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (entriesError) {
      console.error('Error fetching journal entries:', entriesError);
      return [];
    }

    if (!entriesData || entriesData.length === 0) {
      console.log('No journal entries found for user:', userId);
      return [];
    }
    
    console.log(`Found ${entriesData.length} journal entries`);
    
    // Process entries and fetch conversations where needed
    const entries: JournalEntry[] = [];
    
    for (const entryData of entriesData) {
      try {
        let conversationData = null;
        
        // If the entry has a conversation_id, fetch the conversation data
        if (entryData.conversation_id) {
          console.log(`Fetching conversation data for entry ${entryData.id} with conversation_id ${entryData.conversation_id}`);
          
          // First get the conversation
          const { data: conversationResult } = await supabase
            .from('conversations')
            .select('*')
            .eq('id', entryData.conversation_id)
            .single();
            
          if (conversationResult) {
            conversationData = conversationResult;
            
            // Then get messages for this conversation
            const { data: messagesData } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', entryData.conversation_id)
              .order('timestamp', { ascending: true });
              
            if (messagesData && messagesData.length > 0) {
              console.log(`Found ${messagesData.length} messages for conversation ${entryData.conversation_id}`);
              conversationData.messages = messagesData;
            }
          }
        }
        
        // Map the entry with any conversation data we found
        const entry = mapDatabaseEntryToJournalEntry(entryData, userId, conversationData);
        entries.push(entry);
      } catch (err) {
        console.error('Error processing journal entry:', err, entryData);
        // Create a fallback entry with minimal information
        const fallbackEntry: JournalEntry = {
          id: entryData.id,
          userId: entryData.user_id,
          title: entryData.prompt || 'Untitled Entry',
          content: 'Content could not be loaded',
          type: (entryData.type as 'journal' | 'story' | 'sideQuest' | 'action' | 'summary') || 'journal',
          createdAt: new Date(entryData.created_at),
          prompt: entryData.prompt || null,
          conversation_id: entryData.conversation_id || null
        };
        entries.push(fallbackEntry);
      }
    }
    
    return entries;
  } catch (error) {
    console.error('Error processing journal entries:', error);
    return [];
  }
};
