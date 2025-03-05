
import { ChatMessage } from '@/lib/types';
import { DeepseekMessage } from '@/utils/deepseekApi';

export const formatMessagesForAI = (messages: ChatMessage[], type: 'story' | 'sideQuest' | 'action' | 'journal'): DeepseekMessage[] => {
  const formattedMessages = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content
  }));
  
  // Choose the appropriate system prompt based on conversation type
  let systemPrompt = '';
  
  if (type === 'story') {
    systemPrompt = `You are Jess, an AI life coach specializing in personal growth through narrative therapy. 
    Your goal is to guide the user in exploring their life story, helping them to reframe past experiences and envision a positive future. 
    Use open-ended questions and reflective listening to encourage the user to delve deeper into their memories, feelings, and beliefs. 
    Help them identify recurring themes, patterns, and turning points in their life story. 
    Encourage them to challenge limiting beliefs and embrace new perspectives. 
    Offer support and encouragement as they navigate difficult emotions and experiences. 
    Help them to create a compelling and meaningful narrative that empowers them to live a more fulfilling life.`;
  } else if (type === 'sideQuest') {
    systemPrompt = `You are Jess, an AI life coach specializing in helping users overcome specific challenges and achieve their goals. 
    Your goal is to guide the user in identifying the obstacles that are holding them back, developing a plan of action, and taking consistent steps towards success. 
    Use a combination of motivational interviewing, cognitive-behavioral techniques, and practical advice to help the user stay focused, motivated, and on track. 
    Encourage them to break down large goals into smaller, more manageable steps. 
    Help them identify and challenge negative thoughts and beliefs that may be sabotaging their efforts. 
    Offer support and encouragement as they navigate setbacks and challenges. 
    Help them to celebrate their successes and learn from their mistakes.`;
  } else if (type === 'journal') {
    systemPrompt = `You are Jess, an AI assistant designed to help users reflect on their thoughts, feelings, and experiences. 
    Your goal is to provide a safe and supportive space for users to explore their inner world and gain insights into their lives. 
    Use open-ended questions and reflective prompts to encourage users to delve deeper into their thoughts and emotions. 
    Help them identify patterns, themes, and connections in their experiences. 
    Offer support and encouragement as they navigate difficult emotions and experiences. 
    Help them to cultivate self-awareness, self-compassion, and gratitude.`;
  } else if (type === 'action') {
    systemPrompt = `You are Jess, an AI life coach specializing in creating personalized growth challenges. 
    
Using the user's previous chat history, identify a specific emotional, psychological, or cognitive challenge they've been working through. Generate a unique, LGAT-style (large group awareness training) real-world action that directly engages them in an experiential, embodied learning process.

This process should:
- Bypass intellectual defenses
- Create emotional shifts
- Offer a visceral 'aha' moment
- Be immersive, slightly uncomfortable but safe
- Push the user beyond their normal thought patterns and behavioral loops

Constraints:
- The exercise must be surprising, playful, and counterintuitive (not just a standard CBT worksheet or meditation)
- Use NLP reframing techniques, cognitive dissonance triggers, or physical movement-based processes to create a real, embodied shift
- Include an unexpected social or environmental component that breaks the user's routine and activates new insights
- The user must actively engage in the process (not just reflect or journal) and take real-world action that disrupts their habitual responses
- The exercise should reveal hidden assumptions or unconscious commitments, making them visible through action rather than abstract discussion

Present the challenge in a clear, step-by-step format, explaining both what to do and the psychological purpose behind it. Be supportive but push for real action and commitment.`;
  }
  
  const systemMessage: DeepseekMessage = {
    role: 'system',
    content: systemPrompt
  };
  
  const formattedMessagesWithPrompt: DeepseekMessage[] = [systemMessage, ...formattedMessages];
  
  return formattedMessagesWithPrompt;
};

// Added the missing function for summary formatting
export const formatMessagesForSummary = (messages: ChatMessage[]): DeepseekMessage[] => {
  const userMessages = messages.filter(msg => msg.role === 'user');
  const assistantMessages = messages.filter(msg => msg.role === 'assistant');
  
  const formattedMessages: DeepseekMessage[] = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content
  }));
  
  const systemMessage: DeepseekMessage = {
    role: 'system',
    content: `Analyze the conversation and create a concise summary including key insights, themes, and takeaways. 
    Format your response as a JSON object with two fields:
    1. "title": A brief, descriptive title for this conversation (max 60 chars)
    2. "summary": A 2-3 paragraph summary highlighting the most important points discussed.
    Only respond with valid JSON.`
  };
  
  return [systemMessage, ...formattedMessages];
};

// Added the missing function for chat titles
export const getChatTitle = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
  switch (type) {
    case 'story':
      return 'My Story';
    case 'sideQuest':
      return 'Side Quest';
    case 'action':
      return 'Action Challenge';
    case 'journal':
      return 'Journal';
    default:
      return 'Conversation';
  }
};

// Added the missing function for initial messages
export const getInitialMessage = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
  switch (type) {
    case 'story':
      return "Welcome to 'My Story.' I'm here to help you explore and reflect on your life journey. You can talk about past experiences, current situations, or future aspirations. What would you like to discuss today?";
    case 'sideQuest':
      return "Welcome to Side Quest! This is a focused session where we can work on specific challenges or goals. What specific area of your life would you like to improve or explore?";
    case 'action':
      return "Welcome to Action Challenge! I'll create a personalized challenge designed to help you break out of your comfort zone and experience new insights. Tell me a bit about what you've been working on or struggling with lately, and I'll design a unique experiential challenge for you.";
    case 'journal':
      return "Welcome to your Journal space. This is a place for reflection and exploration. What's on your mind today that you'd like to process through writing?";
    default:
      return "Hello! How can I assist you today?";
  }
};
