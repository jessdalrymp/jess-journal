
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
    console.log("UserDataProvider - Initial user fetch");
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      console.log("UserDataProvider - Fetching profile for user:", user.id);
      fetchProfile();
    }
  }, [user, fetchProfile]);

  // Always fetch journal entries when user is loaded and force a refresh on mount
  useEffect(() => {
    if (user) {
      console.log("UserDataProvider - Fetching journal entries on user load");
      // Force a full refresh of journal entries
      fetchJournalEntries().catch(err => {
        console.error("Error fetching journal entries on user load:", err);
      });
      checkSubscriptionStatus();
    }
  }, [user, fetchJournalEntries, checkSubscriptionStatus]);

  // Refresh journal entries periodically - more frequently now for better UX
  useEffect(() => {
    if (!user) return;
    
    const refreshInterval = setInterval(() => {
      console.log("UserDataProvider - Periodic journal refresh");
      fetchJournalEntries().catch(err => {
        console.error("Error in periodic journal refresh:", err);
      });
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(refreshInterval);
  }, [user, fetchJournalEntries]);

  // Additional fetch on window focus for better reliability
  useEffect(() => {
    if (!user) return;

    const handleFocus = () => {
      console.log("UserDataProvider - Window focused, refreshing journal entries");
      fetchJournalEntries().catch(err => {
        console.error("Error refreshing journal entries on focus:", err);
      });
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, fetchJournalEntries]);

  const handleAddMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<boolean> => {
    try {
      const result = await addMessageToConversation(conversationId, content, role);
      
      if (role === 'assistant') {
        if (user) {
          console.log("Marking journal entries as not fetched to trigger refresh after conversation update");
          // Force a refresh of journal entries after assistant messages are added
          fetchJournalEntries();
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
