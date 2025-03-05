
import { ChatMessage } from '@/lib/types';
import { DeepseekMessage } from '../../utils/deepseekApi';

export const getInitialMessage = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
  switch (type) {
    case 'story':
      return "Let's get to know you better. Tell me a pivotal story in your life that still holds emotional weight for you. It could be a moment that changed your perspective or a challenging experience that shaped who you are today.";
    case 'sideQuest':
      return "What specific challenge are you facing right now that you'd like to work through together?";
    case 'action':
      return "Based on our conversations, I'll create a personalized challenge for you that will help shift your perspective through direct experience. Ready to discover something new about yourself?";
    case 'journal':
      return "I've prepared a reflective writing prompt that will help you explore your thoughts more deeply. Are you ready for today's journal challenge?";
    default:
      return "How can I help you today?";
  }
};

export const getSystemPrompt = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
  switch (type) {
    case 'story':
      return `You are Jess, an empathetic AI assistant focused on helping users explore their personal stories. 
      Your goal is to guide users through a process of self-discovery following this structure:
      
      1. STORY EXPLORATION & THEMATIC ANALYSIS:
        - Help users reflect on pivotal life experiences
        - Ask layered, thoughtful questions about emotions and motivations
        - Identify recurring themes and patterns in their narrative
        - Point out potential limiting beliefs with sensitivity
        
      2. NAMING THE HARM & REFRAMING THE NARRATIVE:
        - Gently challenge limiting beliefs when appropriate
        - Encourage users to consider alternative perspectives
        - Prompt users to rewrite their story from a more empowering angle
      
      Always:
      - Focus on questions rather than solutions
      - Be conversational and empathetic
      - Adapt your approach based on the user's responses
      - Remember details from previous exchanges
      - Keep your responses concise (3-5 sentences max) and conversational
      
      Begin by asking about a pivotal story in their life that still holds emotional weight.`;
    // ... Add cases for other conversation types if needed
    default:
      return "You are a helpful assistant.";
  }
};

export const getChatTitle = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
  switch (type) {
    case 'story':
      return "Let's Get to Know You";
    case 'sideQuest':
      return "Side Quest";
    case 'action':
      return "Action Challenge";
    case 'journal':
      return "Journal Challenge";
    default:
      return "Chat";
  }
};

export const formatMessagesForAI = (messages: ChatMessage[], type: 'story' | 'sideQuest' | 'action' | 'journal'): DeepseekMessage[] => {
  const systemMessage: DeepseekMessage = {
    role: 'system',
    content: getSystemPrompt(type)
  };
  
  const formattedMessages: DeepseekMessage[] = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content
  }));
  
  return [systemMessage, ...formattedMessages];
};
