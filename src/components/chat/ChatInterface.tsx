
import { useState, useRef, useEffect } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { ActionButton } from '../ui/ActionButton';
import { useToast } from '@/hooks/use-toast';
import { Send, ArrowLeft } from 'lucide-react';
import { ConversationSession, ChatMessage } from '@/lib/types';

interface ChatInterfaceProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
}

const getInitialMessage = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
  switch (type) {
    case 'story':
      return "I'd love to hear more about your story. What's a pivotal experience in your life that still holds emotional weight for you?";
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

const getChatTitle = (type: 'story' | 'sideQuest' | 'action' | 'journal'): string => {
  switch (type) {
    case 'story':
      return "My Story";
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

const mockAIResponse = (message: string, type: string): string => {
  if (type === 'story') {
    return "Thank you for sharing that story with me. I can see how that experience has shaped your perspective. What emotions come up for you when you think about this event now?";
  } else if (type === 'sideQuest') {
    return "That's a challenging situation. Let's break it down together. What do you think is the core issue behind this challenge?";
  } else if (type === 'action') {
    return "Here's your personalized challenge: For the next 3 days, start your morning by writing down three things that bring you joy before checking your phone. Notice how this shifts your mindset throughout the day. This simple practice will help interrupt patterns of negative thinking that we've identified in our conversations. Are you up for it?";
  } else if (type === 'journal') {
    return "Today's journal prompt: Describe a moment when you felt truly alive and present. What were you doing? Who were you with? What sensations do you remember? Take 10 minutes to write freely without editing yourself.";
  }
  
  return "I understand. Tell me more about how that makes you feel.";
};

export const ChatInterface = ({ type, onBack }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { startConversation, addMessageToConversation } = useUserData();
  const { toast } = useToast();
  
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Start a new conversation session
        const newSession = await startConversation(type);
        setSession(newSession);
        
        // Add initial AI message
        const initialMessage = getInitialMessage(type);
        await addMessageToConversation(
          newSession.id,
          initialMessage,
          'assistant'
        );
        
        // Update the local state
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
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages]);
  
  const handleSendMessage = async () => {
    if (!message.trim() || !session) return;
    
    const userMessage = message;
    setMessage('');
    setLoading(true);
    
    try {
      // Add user message
      await addMessageToConversation(session.id, userMessage, 'user');
      
      // Update local state immediately for user message
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
      
      // Simulate AI thinking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get AI response (mocked for now, will be replaced with actual AI)
      const aiResponse = mockAIResponse(userMessage, type);
      
      // Add AI response
      await addMessageToConversation(session.id, aiResponse, 'assistant');
      
      // Update local state for AI response
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: aiResponse,
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
            className={msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'}
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
          />
        </div>
      </div>
    </div>
  );
};
