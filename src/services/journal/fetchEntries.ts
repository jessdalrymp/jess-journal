
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
    console.log('Current time:', new Date().toISOString());
    
    // Fetch all journal entries directly with improved logging
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
    
    // Log date range of fetched entries to debug date filtering issues
    if (entriesData.length > 0) {
      const oldestEntry = [...entriesData].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )[0];
      
      const newestEntry = [...entriesData].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      
      console.log('Date range of entries from database:', {
        oldest: new Date(oldestEntry.created_at).toISOString(),
        newest: new Date(newestEntry.created_at).toISOString()
      });
      
      // Log the most recent entries for debugging
      console.log('Most recent entries from database:', entriesData.slice(0, 3).map(entry => ({
        id: entry.id,
        created_at: entry.created_at,
        type: entry.type,
        title: entry.prompt?.substring(0, 30) || 'No title'
      })));
    }
    
    // Get all unique conversation IDs from the entries
    const conversationIds = entriesData
      .filter(entry => entry.conversation_id)
      .map(entry => entry.conversation_id);
    
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
      }
    }
    
    // Process entries and map messages to entries
    const entries: JournalEntry[] = [];
    
    for (const entryData of entriesData) {
      try {
        // Get messages for this entry's conversation if it exists
        const messagesData = entryData.conversation_id 
          ? messagesMap[entryData.conversation_id] || null
          : null;
        
        // Map the entry with any messages data we found
        const entry = mapDatabaseEntryToJournalEntry(entryData, userId, messagesData);
        
        // Log the entry's date for debugging
        console.log(`Processed entry: ${entry.id}, date: ${new Date(entry.createdAt).toISOString()}, type: ${entry.type}`);
        
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
    
    // Log the final processed entries for debugging
    console.log(`Successfully processed ${entries.length} entries`);
    if (entries.length > 0) {
      console.log('Date range of processed entries:', {
        oldest: new Date(Math.min(...entries.map(e => new Date(e.createdAt).getTime()))).toISOString(),
        newest: new Date(Math.max(...entries.map(e => new Date(e.createdAt).getTime()))).toISOString()
      });
      
      // Log newest entries
      console.log('Newest processed entries:', 
        [...entries]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
          .map(e => ({
            id: e.id,
            title: e.title,
            type: e.type,
            createdAt: new Date(e.createdAt).toISOString(),
            conversation_id: e.conversation_id
          }))
      );
    }
    
    return entries;
  } catch (error) {
    console.error('Error processing journal entries:', error);
    return [];
  }
};
