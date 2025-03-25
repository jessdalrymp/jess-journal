
// This file is maintained for backward compatibility
// It re-exports all functionality from the new modular structure
export * from './types';
export * from './conversationCache';
export * from './conversationSummary';
export * from './fetchConversations';
export * from './manageConversations';
export * from './deleteConversation';
export * from './journalIntegration';

// Direct export for backward compatibility
export const saveConversationSummary = async (
  userId: string, 
  title: string, 
  summary: string, 
  conversationId: string, 
  type: 'story' | 'sideQuest' | 'action' | 'journal'
): Promise<boolean> => {
  const { saveJournalEntryFromConversation } = await import('./journalIntegration');
  const { linkJournalEntryToConversation } = await import('./journalIntegration');
  
  try {
    // Create a journal entry from the conversation
    const success = await saveJournalEntryFromConversation(
      userId,
      title,
      summary,
      type
    );
    
    if (success && conversationId) {
      // Get the latest journal entry (should be the one we just created)
      const { fetchJournalEntries } = await import('../journal');
      const entries = await fetchJournalEntries(userId);
      
      if (entries && entries.length > 0) {
        // Latest entry should be first in the sorted list
        const latestEntry = entries.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        // Link the entry to the conversation
        await linkJournalEntryToConversation(latestEntry.id, conversationId);
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error saving conversation summary:', error);
    return false;
  }
};
