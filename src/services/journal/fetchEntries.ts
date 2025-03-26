
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
      throw new Error(`Failed to fetch journal entries: ${entriesError.message}`);
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
          
          try {
            // First get the conversation
            const { data: conversationResult, error: conversationError } = await supabase
              .from('conversations')
              .select('*')
              .eq('id', entryData.conversation_id)
              .single();
              
            if (conversationError) {
              console.error(`Error fetching conversation ${entryData.conversation_id}:`, conversationError);
            } else if (conversationResult) {
              conversationData = conversationResult;
              
              try {
                // Then get messages for this conversation
                const { data: messagesData, error: messagesError } = await supabase
                  .from('messages')
                  .select('*')
                  .eq('conversation_id', entryData.conversation_id)
                  .order('timestamp', { ascending: false });
                  
                if (messagesError) {
                  console.error(`Error fetching messages for conversation ${entryData.conversation_id}:`, messagesError);
                } else if (messagesData && messagesData.length > 0) {
                  console.log(`Found ${messagesData.length} messages for conversation ${entryData.conversation_id}`);
                  conversationData.messages = messagesData;
                }
              } catch (messagesErr) {
                console.error(`Error processing messages for conversation ${entryData.conversation_id}:`, messagesErr);
              }
            }
          } catch (conversationErr) {
            console.error(`Error processing conversation ${entryData.conversation_id}:`, conversationErr);
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
          type: (entryData.type as 'journal' | 'story' | 'sideQuest' | 'action') || 'journal',
          createdAt: new Date(entryData.created_at),
          prompt: entryData.prompt || null,
          conversation_id: entryData.conversation_id || null
        };
        entries.push(fallbackEntry);
      }
    }
    
    console.log(`Successfully processed ${entries.length} journal entries`);
    return entries;
  } catch (error) {
    console.error('Error processing journal entries:', error);
    throw error; // Re-throw to allow proper error handling
  }
};
