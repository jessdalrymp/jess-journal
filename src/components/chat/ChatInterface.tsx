
import { useState, useRef, useEffect } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { ActionButton } from '../ui/ActionButton';
import { useToast } from '@/hooks/use-toast';
import { Send, ArrowLeft } from 'lucide-react';
import { ConversationSession, ChatMessage } from '@/lib/types';
import { generateDeepseekResponse, DeepseekMessage } from '../../utils/deepseekApi';

interface ChatInterfaceProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
}

const getInitialMessage = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
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

const getSystemPrompt = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
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

const getChatTitle = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
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

export const ChatInterface = ({ type, onBack }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { startConversation, addMessageToConversation, conversations } = useUserData();
  const { toast } = useToast();
  
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const newSession = await startConversation(type);
        setSession(newSession);
        
        const initialMessage = getInitialMessage(type);
        await addMessageToConversation(
          newSession.id,
          initialMessage,
          'assistant'
        );
        
        setSession(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: Date.now().toString(),
                role: 'assistant',
                content: initialMessage,
                timestamp: new Date(),
              },
            ],
          };
        });
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast({
          title: "Error starting conversation",
          description: "Please try again later.",
          variant: "destructive",
        });
        onBack();
      }
    };
    
    initializeChat();
  }, []);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages]);
  
  const formatMessagesForAI = (messages: ChatMessage[]): DeepseekMessage[] => {
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
  
  const handleSendMessage = async () => {
    if (!message.trim() || !session) return;
    
    const userMessage = message;
    setMessage('');
    setLoading(true);
    
    try {
      await addMessageToConversation(session.id, userMessage, 'user');
      
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: Date.now().toString(),
              role: 'user',
              content: userMessage,
              timestamp: new Date(),
            },
          ],
        };
      });
      
      // Get updated messages including the new user message
      const updatedMessages = session.messages.concat({
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      });
      
      // Format messages for DeepSeek API
      const aiMessages = formatMessagesForAI(updatedMessages);
      
      // Get AI response
      const response = await generateDeepseekResponse(aiMessages);
      const aiResponseText = response.choices[0].message.content;
      
      await addMessageToConversation(session.id, aiResponseText, 'assistant');
      
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: Date.now().toString(),
              role: 'user',
              content: userMessage,
              timestamp: new Date(),
            },
            {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: aiResponseText,
              timestamp: new Date(),
            },
          ],
        };
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!session) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse">Loading conversation...</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white border-b border-jess-subtle py-3 px-4 flex items-center">
        <button
          onClick={onBack}
          className="p-1 mr-3 rounded-full hover:bg-jess-subtle transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-medium text-lg">{getChatTitle(type)}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.map((msg: ChatMessage) => (
          <div
            key={msg.id}
            className={`${msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'} p-3 rounded-lg mb-2 ${
              msg.role === 'user' ? 'bg-jess-primary bg-opacity-10 ml-auto max-w-[80%]' : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-jess-subtle p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 input-base"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={loading}
          />
          <ActionButton
            type="primary"
            onClick={handleSendMessage}
            disabled={!message.trim() || loading}
            className="ml-2 w-10 h-10 p-0 rounded-full flex items-center justify-center"
            icon={<Send size={18} />}
          >
            <span className="sr-only">Send</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
