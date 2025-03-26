
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchConversations } from '@/services/conversation/fetchConversations';
import { Conversation } from '@/services/conversation/types';

export const usePriorConversations = () => {
  const [priorConversations, setPriorConversations] = useState<Conversation[]>([]);
  const [loadingPriorConversations, setLoadingPriorConversations] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadPriorConversations = async () => {
      if (!user) return;
      
      try {
        setLoadingPriorConversations(true);
        const conversations = await fetchConversations(user.id);
        
        const storyConversations = conversations.filter(conv => conv.type === 'story');
        
        console.log(`Loaded ${storyConversations.length} prior story conversations:`, storyConversations);
        setPriorConversations(storyConversations);
      } catch (error) {
        console.error('Error fetching prior conversations:', error);
        toast({
          title: "Error loading conversations",
          description: "Could not load your previous conversations.",
          variant: "destructive"
        });
      } finally {
        setLoadingPriorConversations(false);
      }
    };
    
    loadPriorConversations();
  }, [user, toast]);
  
  return {
    priorConversations,
    loadingPriorConversations
  };
};
