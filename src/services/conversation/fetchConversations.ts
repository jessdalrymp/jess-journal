import { supabase } from '../../integrations/supabase/client';
import { Conversation } from './types';
import { getCachedConversation, cacheConversation } from './conversationCache';

export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('profile_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      userId: item.profile_id,
      type: item.type,
      title: item.title,
      messages: [],
      summary: item.summary || '',
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Error in fetchConversations:', error);
    return [];
  }
};

export const fetchConversation = async (conversationId: string, userId: string): Promise<Conversation | null> => {
  try {
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
      .single();

    if (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }

    if (!data) {
      console.log(`No conversation found with id ${conversationId}`);
      return null;
    }

    // Fetch messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      console.log('Will create conversation without messages');
    }

    console.log(`Fetched ${messages?.length || 0} messages for conversation ${conversationId}`);

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
    return null;
  }
};
