
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
  try {
    // Import the functions directly to avoid circular dependencies
    const result = await import('./journalIntegration').then(module => {
      return module.saveConversationSummary(userId, title, summary, conversationId, type);
    });
    
    if (result && conversationId) {
      // Get the latest journal entry (should be the one we just created)
      const { fetchJournalEntries } = await import('../journal');
      const entries = await fetchJournalEntries(userId);
      
      if (entries && entries.length > 0) {
        // Latest entry should be first in the sorted list
        const latestEntry = entries.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        // Link the entry to the conversation using dynamic import
        await import('./journalIntegration').then(module => {
          return module.linkJournalEntryToConversation(latestEntry.id, conversationId);
        });
      }
    }
    
    return !!result;
  } catch (error) {
    console.error('Error saving conversation summary:', error);
    return false;
  }
};
