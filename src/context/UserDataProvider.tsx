import React, { useState, useEffect, useRef } from 'react';
import { MoodType, MoodEntry, JournalEntry } from '../lib/types';
import { UserDataContext } from './UserDataContext';
import { useUserData } from '../hooks/useUserData';
import { useMoodActions } from '../hooks/useMoodActions';
import { useJournalActions } from '../hooks/useJournalActions';
import { useConversationData } from '../hooks/useConversationData';
import { useToast } from '@/hooks/use-toast';

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
  const isFetchingJournal = useRef(false);
  
  const moodActions = useMoodActions();
  const journalActions = useJournalActions();
  const { loading: conversationLoading, startConversation, addMessageToConversation } = useConversationData(user?.id);
  const { toast } = useToast();
  
  const loading = userLoading || moodActions.loading || 
                 journalActions.loading || conversationLoading;

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
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

  const fetchJournalEntries = async (): Promise<JournalEntry[]> => {
    if (!user) return [];
    
    // Prevent concurrent fetches
    if (isFetchingJournal.current) {
      console.log("Journal fetch already in progress, skipping");
      return journalEntries;
    }
    
    try {
      isFetchingJournal.current = true;
      console.log("Fetching journal entries for user:", user.id);
      const entries = await journalActions.fetchJournalEntries(user.id);
      setJournalEntries(entries);
      setIsJournalFetched(true);
      return entries;
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      return [];
    } finally {
      isFetchingJournal.current = false;
    }
  };

  const handleAddMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant') => {
    try {
      const shouldRefreshEntries = await addMessageToConversation(conversationId, content, role);
      
      if (role === 'assistant' && shouldRefreshEntries) {
        // Don't fetch here, just let the dashboard handle this when viewed
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
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
