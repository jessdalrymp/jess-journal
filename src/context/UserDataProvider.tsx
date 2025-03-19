
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

  // Only fetch journal entries when user is loaded and entries haven't been fetched yet
  useEffect(() => {
    if (user && !isJournalFetched) {
      console.log("Triggering journal entries fetch");
      fetchJournalEntries(true); // Force refresh
      checkSubscriptionStatus();
    }
  }, [user, isJournalFetched]);

  const handleAddMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<boolean> => {
    try {
      const result = await addMessageToConversation(conversationId, content, role);
      
      if (role === 'assistant') {
        if (user) {
          console.log("Marking journal entries as not fetched to trigger refresh after conversation update");
          setIsJournalFetched(false);
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

  const refreshJournalEntries = async () => {
    if (user) {
      console.log("Manually refreshing journal entries");
      return await fetchJournalEntries(true); // Force refresh
    }
    return [];
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
    fetchJournalEntries: refreshJournalEntries,
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
