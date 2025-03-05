
import React, { useState, useEffect } from 'react';
import { User, UserProfile, MoodType, MoodEntry, JournalEntry } from '../lib/types';
import { UserDataContext } from './UserDataContext';
import { useUserActions } from '../hooks/useUserActions';
import { useMoodActions } from '../hooks/useMoodActions';
import { useJournalActions } from '../hooks/useJournalActions';
import { useConversationActions } from '../hooks/useConversationActions';
import { useToast } from '@/hooks/use-toast';

interface UserDataProviderProps {
  children: React.ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(null);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalFetched, setIsJournalFetched] = useState(false);
  
  const userActions = useUserActions();
  const moodActions = useMoodActions();
  const journalActions = useJournalActions();
  const conversationActions = useConversationActions();
  const { toast } = useToast();
  
  // Combined loading state
  const loading = userActions.loading || moodActions.loading || 
                 journalActions.loading || conversationActions.loading;

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchMoodEntries();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const userData = await userActions.fetchUser();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast({
        title: "Error loading user data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    }
  };

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const profileData = await userActions.fetchProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const saveProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      return;
    }

    const updatedProfile = await userActions.saveProfile(user.id, profileData);
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  };

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
    if (!user) return;
    
    if (isJournalFetched) {
      // If we've already fetched journal entries, don't fetch again
      console.log("Journal entries already fetched, skipping redundant fetch");
      return;
    }
    
    try {
      console.log("Fetching journal entries for user:", user.id);
      const entries = await journalActions.fetchJournalEntries(user.id);
      setJournalEntries(entries);
      setIsJournalFetched(true);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      // Don't set empty array on error to prevent wiping existing entries
    }
  };

  const startConversation = async (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      return await conversationActions.startConversation(user.id, type);
    } catch (error) {
      console.error(`Error starting ${type} conversation:`, error);
      toast({
        title: `Error starting ${type}`,
        description: "Please try again later",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant') => {
    try {
      await conversationActions.addMessageToConversation(conversationId, content, role, user?.id);
      
      if (role === 'assistant') {
        // Refresh journal entries when assistant adds a message (might create a journal entry)
        setIsJournalFetched(false); // Reset the flag to force a refresh next time
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
    addMessageToConversation,
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
