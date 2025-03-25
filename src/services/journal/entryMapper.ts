
import { JournalEntry } from '@/lib/types';

/**
 * Maps database entry data to a JournalEntry object
 */
export const mapDatabaseEntryToJournalEntry = (
  entryData: any,
  userId: string,
  conversationData: any = null
): JournalEntry => {
  // Create base journal entry
  const entry: JournalEntry = {
    id: entryData.id,
    userId: entryData.user_id || userId,
    title: entryData.title || '',
    content: entryData.content || '',
    type: (entryData.type as 'journal' | 'story' | 'sideQuest' | 'action' | 'summary') || 'journal',
    createdAt: new Date(entryData.created_at),
    prompt: entryData.prompt || null,
    conversation_id: entryData.conversation_id || null
  };

  // If conversation data exists, enhance the entry with it
  if (conversationData) {
    // For entries with conversation_id, we may want to format the content based on the conversation
    if (conversationData.messages && conversationData.messages.length > 0) {
      // If no content was provided, create a summary from the conversation messages
      if (!entry.content || entry.content.trim() === '') {
        // Get the last assistant message as a summary
        const assistantMessages = conversationData.messages.filter(
          (msg: any) => msg.role === 'assistant'
        );
        
        if (assistantMessages.length > 0) {
          const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
          
          // Create a JSON summary format
          const summary = {
            title: conversationData.title || 'Conversation Summary',
            summary: lastAssistantMessage.content.substring(0, 500) + 
              (lastAssistantMessage.content.length > 500 ? '...' : '')
          };
          
          // Format as a JSON code block
          entry.content = '```json\n' + JSON.stringify(summary, null, 2) + '\n```';
        }
      }
      
      // Use conversation title if entry doesn't have a title
      if (!entry.title && conversationData.title) {
        entry.title = conversationData.title;
      }
    }
  }

  return entry;
};
