
import { supabase } from '../../integrations/supabase/client';
import { Conversation } from './types';
import { getCachedConversation, cacheConversation } from './conversationCache';

export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    if (!userId) {
      console.error('No user ID provided to fetchConversations');
      return [];
    }

    console.log('Fetching conversations for user:', userId);

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('profile_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    console.log('Fetched conversations count:', data?.length || 0);

    if (!data || data.length === 0) {
      console.log('No conversations found for user:', userId);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      userId: item.profile_id,
      type: item.type,
      title: item.title || 'Untitled Conversation',
      messages: [],
      summary: item.summary || '',
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Error in fetchConversations:', error);
    throw error;
  }
};

export const fetchConversation = async (conversationId: string, userId: string): Promise<Conversation | null> => {
  try {
    if (!userId) {
      console.error('No user ID provided to fetchConversation');
      return null;
    }

    if (!conversationId) {
      console.error('No conversation ID provided to fetchConversation');
      return null;
    }

    // Check cache first
    const cachedConversation = getCachedConversation(conversationId);
    if (cachedConversation) {
      console.log(`Using cached conversation ${conversationId}`);
      return cachedConversation;
    }

    // Otherwise fetch from database
    console.log(`Fetching conversation ${conversationId} from database`);
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('profile_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching conversation:', error);
      throw new Error(`Failed to fetch conversation: ${error.message}`);
    }

    if (!data) {
      console.log(`No conversation found with id ${conversationId}`);
      throw new Error(`Conversation ${conversationId} not found or not accessible`);
    }

    // Fetch messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true })
      .limit(1000); // Increased limit to get more messages

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      throw new Error(`Failed to fetch messages: ${messagesError.message}`);
    }

    console.log(`Fetched ${messages?.length || 0} messages for conversation ${conversationId}`);

    if (!messages || messages.length === 0) {
      console.warn(`No messages found for conversation ${conversationId}`);
      // Instead of failing, we'll return the conversation without messages
      // and let the calling code handle this case
    }

    // Build conversation object
    const conversation: Conversation = {
      id: data.id,
      userId: data.profile_id,
      type: data.type,
      title: data.title,
      messages: messages ? messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: new Date(msg.timestamp)
      })) : [],
      summary: data.summary || '',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    // Cache the conversation
    cacheConversation(conversation);
    return conversation;
  } catch (error) {
    console.error('Error in fetchConversation:', error);
    throw error;
  }
};
