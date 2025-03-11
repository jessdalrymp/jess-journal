
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
    systemPrompt = `You are Jess, an AI assistant designed to help users reflect deeply on their journaling prompts and challenges. 
    
    Your goal is to provide thoughtful, personalized guidance to help users extract meaningful insights from their journaling experience. You should:
    
    1. Ask specific, thought-provoking questions that help users explore different aspects of their journaling prompt
    2. Encourage users to identify patterns in their thoughts, feelings, and behaviors
    3. Help users connect their reflections to practical insights they can apply in their daily lives
    4. Validate their emotions and experiences while gently challenging limiting beliefs
    5. Suggest different perspectives or angles they might not have considered
    6. Relate their reflections to psychological concepts in a way that's accessible and helpful
    
    Use a warm, empathetic tone while maintaining a structured approach to guide their self-reflection process. Ask questions that build on each other to lead to deeper insights. If users mention specific challenges or breakthroughs, explore these areas further.
    
    Remember to consider the holistic nature of their experience - how thoughts, emotions, behaviors, and external circumstances interact. Help users move from abstract reflection to concrete understanding and actionable insights.`;
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
      return 'Journal Reflection';
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
      return "Welcome to your Journal Reflection. I'm here to help you explore the journal prompt more deeply and extract meaningful insights. What thoughts or feelings came up for you while journaling? Or if you'd like guidance, I can suggest some reflection questions to help you get started.";
    default:
      return "Hello! How can I assist you today?";
  }
};
