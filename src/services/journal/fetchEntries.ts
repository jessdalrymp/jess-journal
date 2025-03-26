
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
    
    // First, let's query to see if there are ANY entries after March 18
    const { data: recentEntries, error: recentError } = await supabase
      .from('journal_entries')
      .select('id, created_at, type')
      .eq('user_id', userId)
      .gt('created_at', '2025-03-18')
      .order('created_at', { ascending: false });
    
    if (recentError) {
      console.error('Error checking for recent entries:', recentError);
    } else {
      console.log('Recent entries check (after March 18):', recentEntries?.length || 0);
      if (recentEntries && recentEntries.length > 0) {
        console.log('Sample of recent entries:', recentEntries.slice(0, 3).map(e => ({
          id: e.id,
          created_at: e.created_at,
          type: e.type
        })));
      }
    }
    
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
      
      // Log entry counts by month to identify any patterns
      const entriesByMonth = entriesData.reduce((acc, entry) => {
        const date = new Date(entry.created_at);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('Entries by month:', entriesByMonth);
      
      // Log entry counts by type to check for pattern
      const entriesByType = entriesData.reduce((acc, entry) => {
        const type = entry.type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('Entries by type:', entriesByType);
      
      // Check for differences in structure between old and new entries
      const oldEntries = entriesData.filter(e => new Date(e.created_at) < new Date('2025-03-19'));
      const newEntries = entriesData.filter(e => new Date(e.created_at) >= new Date('2025-03-19'));
      
      console.log('Old entries count (before Mar 19):', oldEntries.length);
      console.log('New entries count (after Mar 19):', newEntries.length);
      
      if (oldEntries.length > 0 && newEntries.length > 0) {
        const oldSample = oldEntries[0];
        const newSample = newEntries[0];
        
        console.log('Sample old entry structure:', Object.keys(oldSample));
        console.log('Sample new entry structure:', Object.keys(newSample));
        
        // Check for any difference in column values
        const oldHasNull = Object.entries(oldSample).filter(([_, v]) => v === null).map(([k]) => k);
        const newHasNull = Object.entries(newSample).filter(([_, v]) => v === null).map(([k]) => k);
        
        console.log('Old entry null fields:', oldHasNull);
        console.log('New entry null fields:', newHasNull);
      }
      
      // Log the most recent entries for debugging
      console.log('Most recent entries from database:', entriesData.slice(0, 5).map(entry => ({
        id: entry.id,
        created_at: entry.created_at,
        created_at_iso: new Date(entry.created_at).toISOString(),
        type: entry.type,
        title: entry.prompt?.substring(0, 30) || 'No title',
        conversation_id: entry.conversation_id
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
