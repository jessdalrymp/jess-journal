
import React, { useState, useEffect, useRef } from 'react';
import { MoodType, MoodEntry, JournalEntry } from '../lib/types';
import { UserDataContext } from './UserDataContext';
import { useUserData } from '../hooks/useUserData';
import { useMoodActions } from '../hooks/useMoodActions';
import { useJournalActions } from '../hooks/useJournalActions';
import { useConversationData } from '../hooks/useConversationData';
import { useSubscription } from '../hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { Subscription } from './types';

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

  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalFetched, setIsJournalFetched] = useState(false);
  const isFetchingJournalRef = useRef(false);
  
  const moodActions = useMoodActions();
  const journalActions = useJournalActions();
  const { loading: conversationLoading, startConversation, addMessageToConversation } = useConversationData(user?.id);
  const { subscription, loading: subscriptionLoading, checkSubscriptionStatus, applyCoupon } = useSubscription(user?.id);
  const { toast } = useToast();
  
  // Combined loading state
  const loading = userLoading || moodActions.loading || 
                 journalActions.loading || conversationLoading || subscriptionLoading;

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
      checkSubscriptionStatus();
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    if (user) {
      try {
        const entries = await moodActions.fetchMoodEntries(user.id);
        setMoodEntries(entries);
      } catch (error) {
        console.error("Error fetching mood entries:", error);
      }
    }
  };

  const addMoodEntry = async (mood: MoodType, note?: string) => {
    if (!user) return;

    try {
      const newEntry = await moodActions.addMoodEntry(user.id, mood, note);
      if (newEntry) {
        setMoodEntries(prev => [newEntry, ...prev]);
      }
    } catch (error) {
      console.error("Error adding mood entry:", error);
      toast({
        title: "Error saving mood",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const fetchJournalEntries = async () => {
    if (!user) return [];
    
    if (isJournalFetched && isFetchingJournalRef.current) {
      console.log("Journal entries already fetched or being fetched, skipping redundant fetch");
      return journalEntries;
    }
    
    isFetchingJournalRef.current = true;
    
    try {
      console.log("Fetching journal entries for user:", user.id);
      const entries = await journalActions.fetchJournalEntries(user.id);
      setJournalEntries(entries);
      setIsJournalFetched(true);
      return entries;
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      return [];
    } finally {
      isFetchingJournalRef.current = false;
    }
  };

  const handleAddMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant') => {
    try {
      await addMessageToConversation(conversationId, content, role);
      
      if (role === 'assistant') {
        setIsJournalFetched(false);
        if (user) {
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
    moodEntries,
    addMoodEntry,
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
