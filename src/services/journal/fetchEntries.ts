
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
    
    // Fetch all journal entries directly
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
    
    console.log('Raw entries data:', entriesData);
    console.log(`Found ${entriesData.length} journal entries`);
    
    // Get all unique conversation IDs from the entries
    const conversationIds = entriesData
      .filter(entry => entry.conversation_id)
      .map(entry => entry.conversation_id);
    
    console.log('Conversation IDs found:', conversationIds);
    console.log(`Found ${conversationIds.length} unique conversation IDs`);
    
    // Fetch messages for all conversations in a single query if there are any conversation IDs
    let messagesMap: Record<string, any[]> = {};
    
    if (conversationIds.length > 0) {
      console.log('Fetching messages for conversations:', conversationIds);
      
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('timestamp', { ascending: true });
      
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
      } else if (messagesData && messagesData.length > 0) {
        console.log('Raw messages data:', messagesData);
        console.log(`Fetched ${messagesData.length} messages for all conversations`);
        
        // Group messages by conversation_id for easier lookup
        messagesMap = messagesData.reduce((acc, message) => {
          const convId = message.conversation_id;
          if (!acc[convId]) {
            acc[convId] = [];
          }
          acc[convId].push(message);
          return acc;
        }, {} as Record<string, any[]>);
        
        console.log('Grouped messages map:', messagesMap);
      }
    }
    
    // Process entries and map messages to entries
    const entries: JournalEntry[] = [];
    
    for (const entryData of entriesData) {
      try {
        console.log('Processing entry:', {
          id: entryData.id,
          conversation_id: entryData.conversation_id,
          type: entryData.type,
          title: entryData.prompt || 'Untitled Entry'
        });
        
        // Get messages for this entry's conversation if it exists
        const messagesData = entryData.conversation_id 
          ? messagesMap[entryData.conversation_id] || null
          : null;
        
        if (messagesData) {
          console.log(`Using ${messagesData.length} messages for entry ${entryData.id} with conversation ${entryData.conversation_id}`);
          console.log('Messages for entry:', messagesData);
        }
        
        // Map the entry with any messages data we found
        const entry = mapDatabaseEntryToJournalEntry(entryData, userId, messagesData);
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
    
    return entries;
  } catch (error) {
    console.error('Error processing journal entries:', error);
    return [];
  }
};
