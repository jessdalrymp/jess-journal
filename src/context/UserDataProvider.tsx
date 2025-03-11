
import React, { useState, useEffect, useRef } from 'react';
import { JournalEntry } from '../lib/types';
import { UserDataContext } from './UserDataContext';
import { useUserData } from '../hooks/useUserData';
import { useJournalEntries } from '../hooks/journal';
import { useConversationData } from '../hooks/useConversationData';
import { useSubscription } from '../hooks/useSubscription';
import { useToast } from '@/components/ui/use-toast';

interface UserDataProviderProps {
  children: React.ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const { 
    user, 
    profile, 
    loading: userLoading, 
    fetchUser, 
    fetchProfile, 
    saveProfile 
  } = useUserData();

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalFetched, setIsJournalFetched] = useState(false);
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const isFetchingJournalRef = useRef(false);
  
  const { fetchJournalEntries: fetchEntries, loading: journalActionsLoading } = useJournalEntries();
  const { loading: conversationLoading, startConversation, addMessageToConversation } = useConversationData(user?.id);
  const { subscription, loading: subscriptionLoading, checkSubscriptionStatus, applyCoupon } = useSubscription(user?.id);
  const { toast } = useToast();
  
  const loading = userLoading || isJournalLoading || conversationLoading || subscriptionLoading || journalActionsLoading;

  // Only fetch journal entries once when the user is loaded and not already fetched
  useEffect(() => {
    if (user && !isJournalFetched && !isFetchingJournalRef.current) {
      fetchJournalEntries();
      checkSubscriptionStatus();
    }
  }, [user, isJournalFetched]);

  const fetchJournalEntries = async () => {
    if (!user) return [];
    
    if (isFetchingJournalRef.current) {
      console.log("Journal entries already being fetched, skipping redundant fetch");
      return journalEntries;
    }
    
    isFetchingJournalRef.current = true;
    setIsJournalLoading(true);
    
    try {
      console.log("Fetching journal entries for user:", user.id);
      const entries = await fetchEntries(user.id);
      setJournalEntries(entries);
      setIsJournalFetched(true);
      console.log("Successfully fetched", entries.length, "journal entries");
      return entries;
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      toast({
        title: "Error loading journal entries",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
      return [];
    } finally {
      isFetchingJournalRef.current = false;
      setIsJournalLoading(false);
    }
  };

  const handleAddMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant') => {
    try {
      await addMessageToConversation(conversationId, content, role);
      
      // Only refetch journal entries when an assistant message is added
      if (role === 'assistant') {
        // Using a ref to prevent duplicate fetches
        if (!isFetchingJournalRef.current && user) {
          setIsJournalFetched(false);
          await fetchJournalEntries();
        }
      }
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
