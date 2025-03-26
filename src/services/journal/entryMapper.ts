
import { JournalEntry } from '@/lib/types';
import { decryptContent } from './encryption';
import { parseContentWithJsonCodeBlock } from './contentParser';

/**
 * Maps database journal entry object to application JournalEntry type
 * with improved error handling for decryption
 */
export const mapDatabaseEntryToJournalEntry = (
  entry: any, 
  userId: string,
  messagesData: any[] | null = null
): JournalEntry => {
  console.log(`Mapping entry ID: ${entry.id}, created_at: ${entry.created_at}, type: ${entry.type}`);
  
  let content = '';
  let prompt = entry.prompt || null;
  let conversationId = entry.conversation_id || null;
  
  if (conversationId) {
    console.log(`Entry ${entry.id} has conversation_id: ${conversationId}`);
  }
  
  // Try to decrypt the content, but handle errors gracefully
  try {
    content = decryptContent(entry.content, userId);
  } catch (error) {
    console.error('Error decrypting content:', error);
    // Use raw content if decryption fails or a fallback message
    content = entry.content || 'Content could not be decrypted';
  }
  
  // Try to parse the content as JSON
  let parsedContent = null;
  let entryType = entry.type || 'journal';
  let title = prompt ? prompt.substring(0, 50) + (prompt.length > 50 ? '...' : '') : 'Untitled Entry';
  
  try {
    parsedContent = parseContentWithJsonCodeBlock(content);
    
    // Use the parsed title if available
    if (parsedContent && parsedContent.title) {
      title = parsedContent.title;
    }
    
    // Use the parsed type if available
    if (parsedContent && parsedContent.type) {
      entryType = parsedContent.type;
    }
  } catch (error) {
    console.error('Error parsing content:', error);
    // Continue without parsedContent if parsing fails
  }

  // Special handling for conversations
  if (conversationId && messagesData && messagesData.length > 0) {
    console.log(`Processing conversation entry: ${entry.id} with ${messagesData.length} messages`);
    
    // Generate a conversation title if not already set
    if (title === 'Untitled Entry' || title === 'Conversation') {
      // Generate a title based on the first few user messages
      const userMessages = messagesData
        .filter((msg: any) => msg.role === 'user')
        .slice(0, 2);
        
      if (userMessages.length > 0) {
        const firstMessage = userMessages[0].content;
        // Create title from first user message (limited to 40 chars)
        title = firstMessage.length > 40 
          ? firstMessage.substring(0, 40) + '...' 
          : firstMessage;
        
        console.log(`Generated title for conversation entry: ${title}`);
      } else {
        title = `Conversation: ${new Date(entry.created_at).toLocaleDateString()}`;
      }
    }
    
    // Create content from the full conversation
    if (messagesData && messagesData.length > 0) {
      // Format the conversation as content
      const formattedContent = messagesData.map((msg: any) => {
        const role = msg.role === 'user' ? 'You' : 'Assistant';
        return `**${role}:** ${msg.content}`;
      }).join('\n\n');
      
      // If this is a conversation, use the formatted messages instead
      content = formattedContent;
      console.log(`Formatted conversation content with ${messagesData.length} messages`);
    }
  }

  // Special handling for summary type entries
  if (entryType === 'summary' || entry.type === 'summary') {
    console.log('Processing summary entry:', entry.id);
    
    if (title === 'Untitled Entry' || title.includes('Daily Summary:')) {
      if (prompt && prompt.includes('Daily Summary:')) {
        title = prompt;
      } else if (parsedContent && parsedContent.title) {
        title = parsedContent.title;
      } else {
        title = `Daily Journal Summary: ${new Date(entry.created_at).toLocaleDateString()}`;
      }
    }
    
    if (parsedContent && parsedContent.summary) {
      content = parsedContent.summary;
    }
    
    entryType = 'summary';
  }

  // Create and return the finalized journal entry with proper date
  const journalEntry: JournalEntry = {
    id: entry.id,
    userId: entry.user_id,
    title: title,
    content: content,
    type: entryType as 'journal' | 'story' | 'sideQuest' | 'action' | 'summary',
    createdAt: new Date(entry.created_at),
    prompt: prompt,
    conversation_id: conversationId
  };
  
  // Log the mapped entry with its ISO date for consistency
  console.log(`Completed mapping entry ${entry.id}, created: ${journalEntry.createdAt.toISOString()}, type: ${journalEntry.type}`);
  
  return journalEntry;
};
