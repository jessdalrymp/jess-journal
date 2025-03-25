
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
  conversationData: any = null
): JournalEntry => {
  let content = '';
  let prompt = entry.prompt || null;
  let conversationId = entry.conversation_id || null;
  
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

  // Special handling for summary type entries
  if (entryType === 'summary' || entry.type === 'summary') {
    console.log('Processing summary entry:', entry.id);
    
    // If it's a summary but doesn't have a proper title yet
    if (title === 'Untitled Entry' || title.includes('Daily Summary:')) {
      // Try to create a better title from the prompt
      if (prompt && prompt.includes('Daily Summary:')) {
        title = prompt;
      } else if (parsedContent && parsedContent.title) {
        title = parsedContent.title;
      } else {
        title = `Daily Journal Summary: ${new Date(entry.created_at).toLocaleDateString()}`;
      }
    }
    
    // If we have parsed content with a summary field, use that for the content
    if (parsedContent && parsedContent.summary) {
      content = parsedContent.summary;
    }
    
    entryType = 'summary';
  }

  // For conversation summaries, we can enhance the entry with conversation data
  if (conversationId && conversationData) {
    console.log('Processing conversation data for entry:', {
      entryId: entry.id,
      conversationId,
      hasTitle: !!conversationData.title,
      hasSummary: !!conversationData.summary,
      messageCount: conversationData.messages?.length || 0
    });
    
    // If the title is generic, use conversation title if available
    if (title === 'Untitled Entry' || title === 'Conversation Summary') {
      if (conversationData.title) {
        title = conversationData.title;
      } else {
        title = `Conversation: ${new Date(entry.created_at).toLocaleDateString()}`;
      }
    }
    
    // If we have a conversation summary from the conversation record, use it
    if (conversationData.summary && (!content || content === 'No summary available')) {
      content = conversationData.summary;
    }
    
    // Check for assistant messages (summaries) in the messages array
    if (conversationData.messages && conversationData.messages.length > 0) {
      // Look for the most recent assistant message that could be a summary
      const assistantMessages = conversationData.messages
        .filter((msg: any) => msg.role === 'assistant')
        .sort((a: any, b: any) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      
      if (assistantMessages.length > 0) {
        const latestAssistantMessage = assistantMessages[0];
        console.log('Found potential summary message:', {
          messageId: latestAssistantMessage.id,
          contentPreview: latestAssistantMessage.content.substring(0, 50) + '...'
        });
        
        // If we don't have content yet, use the assistant message
        if (!content || content === 'No summary available') {
          content = latestAssistantMessage.content;
          console.log('Using assistant message as summary content');
        }
      }
    }
  }

  return {
    id: entry.id,
    userId: entry.user_id,
    title: title,
    content: content,
    type: entryType as 'journal' | 'story' | 'sideQuest' | 'action' | 'summary',
    createdAt: new Date(entry.created_at),
    prompt: prompt,
    conversation_id: conversationId // Include the conversation_id in the journal entry
  };
};
