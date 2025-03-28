
import React, { useEffect } from 'react';
import { UserDataContext } from './UserDataContext';
import { useUserProfileContext } from '../hooks/useUserProfileContext';
import { useJournalContext } from '../hooks/useJournalContext';
import { useConversationData } from '../hooks/useConversationData';
import { useSubscription } from '../hooks/useSubscription';
import { useToast } from '@/components/ui/use-toast';

interface UserDataProviderProps {
  children: React.ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  // Profile and user data
  const {
    user,
    profile,
    isLoadingUser,
    isLoadingProfile,
    fetchUser,
    fetchProfile,
    saveProfile
  } = useUserProfileContext();
  
  // Journal entries
  const {
    journalEntries,
    isJournalFetched,
    setIsJournalFetched,
    isJournalLoading,
    journalActionsLoading,
    fetchJournalEntries
  } = useJournalContext(user?.id);
  
  // Conversation data
  const { 
    loading: conversationLoading, 
    startConversation, 
    addMessageToConversation 
  } = useConversationData(user?.id);
  
  // Subscription data
  const { 
    subscription, 
    loading: subscriptionLoading, 
    checkSubscriptionStatus, 
    applyCoupon 
  } = useSubscription(user?.id);
  
  const { toast } = useToast();
  
  // Combined loading state
  const loading = isLoadingUser || isLoadingProfile || isJournalLoading || 
                  conversationLoading || subscriptionLoading || journalActionsLoading;

  // Initial data loading
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Fetch journal entries when user is loaded - only on initial load
  useEffect(() => {
    if (user) {
      console.log("UserDataProvider - User loaded, fetching journal entries");
      fetchJournalEntries(true); // Force refresh when user is loaded
      checkSubscriptionStatus();
    }
  }, [user]);

  // Remove periodic refresh for journal entries to prevent refreshing while on the page
  
  const handleAddMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<boolean> => {
    try {
      console.log(`Adding message to conversation ${conversationId}, role: ${role}`);
      const result = await addMessageToConversation(conversationId, content, role);
      
      if (role === 'assistant') {
        if (user) {
          console.log("Assistant message added - triggering journal entries refresh");
          setIsJournalFetched(false);
          
          // Force refresh journal entries immediately after conversation update
          setTimeout(() => {
            console.log("Refreshing journal entries after conversation update");
            fetchJournalEntries(true); // Force refresh
          }, 1000);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      toast({
        title: "Error saving message",
        description: "Your message might not have been saved",
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    fetchUser,
    fetchProfile,
    saveProfile,
    startConversation,
    addMessageToConversation: handleAddMessageToConversation,
    journalEntries,
    fetchJournalEntries,
    subscription,
    checkSubscriptionStatus,
    applyCoupon
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
