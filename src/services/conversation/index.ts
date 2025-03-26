
// This file is maintained for backward compatibility
// It re-exports all functionality from the new modular structure
export * from './types';
export * from './conversationCache';
export * from './conversationSummary';
export * from './fetchConversations';
export * from './manageConversations';
export * from './deleteConversation';
export * from './journalIntegration';
export * from './journalEntryHelpers';

// Updated direct export for saving conversations without summary
export const saveConversationToJournal = async (
  userId: string, 
  title: string, 
  conversationId: string, 
  type: 'story' | 'sideQuest' | 'action' | 'journal'
): Promise<boolean> => {
  try {
    // Import the function directly to avoid circular dependencies
    const result = await import('./journalIntegration').then(module => {
      return module.saveConversationToJournal(userId, title, conversationId, type);
    });
    
    return !!result;
  } catch (error) {
    console.error('Error saving conversation to journal:', error);
    return false;
  }
};

// Export the saveJournalEntryFromConversation function
export { saveJournalEntryFromConversation } from './journalIntegration';
