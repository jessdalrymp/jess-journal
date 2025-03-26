
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
    // NOTE: Updated table name from "journal_entries" to "Journal_Entries"
    const { data: entriesData, error: entriesError } = await supabase
      .from('Journal_Entries')
      .select('*')
      .eq('User_id', userId)  // Updated column name from "user_id" to "User_id"
      .order('Created_at', { ascending: false });  // Updated column name from "created_at" to "Created_at"

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
        new Date(a.Created_at).getTime() - new Date(b.Created_at).getTime() // Updated column name
      )[0];
      
      const newestEntry = [...entriesData].sort((a, b) => 
        new Date(b.Created_at).getTime() - new Date(a.Created_at).getTime() // Updated column name
      )[0];
      
      console.log('Date range of entries from database:', {
        oldest: new Date(oldestEntry.Created_at).toISOString(),  // Updated column name
        newest: new Date(newestEntry.Created_at).toISOString()   // Updated column name
      });
      
      // Log the most recent entries for debugging
      console.log('Most recent entries from database:', entriesData.slice(0, 3).map(entry => ({
        id: entry.id,
        created_at: entry.Created_at,  // Updated column name
        created_at_iso: new Date(entry.Created_at).toISOString(),  // Updated column name
        type: entry.Type,  // Updated column name
        title: entry.Prompt?.substring(0, 30) || 'No title'  // Updated column name
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
      
      // NOTE: Updated table name from "messages" to "Messages"
      const { data: messagesData, error: messagesError } = await supabase
        .from('Messages')
        .select('*')
        .in('conversation', conversationIds) // Updated column name from "conversation_id" to "conversation"
        .order('timestamp', { ascending: true });
      
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
      } else if (messagesData && messagesData.length > 0) {
        console.log(`Fetched ${messagesData.length} messages for all conversations`);
        
        // Group messages by conversation_id for easier lookup
        messagesMap = messagesData.reduce((acc, message) => {
          const convId = message.conversation; // Updated column name from "conversation_id" to "conversation"
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
          userId: entryData.User_id,  // Updated column name from "user_id" to "User_id"
          title: entryData.Prompt || 'Untitled Entry',  // Updated column name from "prompt" to "Prompt"
          content: 'Content could not be loaded',
          type: (entryData.Type as 'journal' | 'story' | 'sideQuest' | 'action' | 'summary') || 'journal',  // Updated column name from "type" to "Type"
          createdAt: new Date(entryData.Created_at),  // Updated column name from "created_at" to "Created_at"
          prompt: entryData.Prompt || null,  // Updated column name from "prompt" to "Prompt"
          conversation_id: entryData.conversation_id || null
        };
        entries.push(fallbackEntry);
      }
    }
    
    // Log the final processed entries for debugging
    console.log(`Successfully processed ${entries.length} entries`);
    if (entries.length > 0) {
      // Ensure all dates are proper Date objects
      const sortedEntries = [...entries].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      
      console.log('Date range of processed entries:', {
        oldest: new Date(Math.min(...entries.map(e => new Date(e.createdAt).getTime()))).toISOString(),
        newest: new Date(Math.max(...entries.map(e => new Date(e.createdAt).getTime()))).toISOString()
      });
      
      // Log newest entries
      console.log('Newest processed entries:', 
        sortedEntries.slice(0, 3).map(e => ({
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
