
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, UserProfile, MoodType, MoodEntry, JournalEntry } from '../lib/types';
import { UserData } from './types';
import { useUserActions } from '../hooks/useUserActions';
import { useMoodActions } from '../hooks/useMoodActions';
import { useJournalActions } from '../hooks/useJournalActions';
import { useConversationActions } from '../hooks/useConversationActions';

const UserDataContext = createContext<UserData | undefined>(undefined);

interface UserDataProviderProps {
  children: React.ReactNode;
}

const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(null);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  
  const userActions = useUserActions();
  const moodActions = useMoodActions();
  const journalActions = useJournalActions();
  const conversationActions = useConversationActions();
  
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
      fetchJournalEntries();
    }
  }, [user]);

  const fetchUser = async () => {
    const userData = await userActions.fetchUser();
    setUser(userData);
  };

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileData = await userActions.fetchProfile(user.id);
    setProfile(profileData);
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
      const entries = await moodActions.fetchMoodEntries(user.id);
      setMoodEntries(entries);
    }
  };

  const addMoodEntry = async (mood: MoodType, note?: string) => {
    if (!user) return;

    const newEntry = await moodActions.addMoodEntry(user.id, mood, note);
    if (newEntry) {
      setMoodEntries(prev => [newEntry, ...prev]);
    }
  };

  const fetchJournalEntries = async () => {
    if (user) {
      const entries = await journalActions.fetchJournalEntries(user.id);
      setJournalEntries(entries);
    }
  };

  const startConversation = async (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    return await conversationActions.startConversation(user.id, type);
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant') => {
    try {
      await conversationActions.addMessageToConversation(conversationId, content, role, user?.id);
      
      if (role === 'assistant') {
        fetchJournalEntries();
      }
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      throw error;
    }
  };

  const value: UserData = {
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

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export { UserDataProvider };
