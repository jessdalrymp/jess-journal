
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, UserProfile, MoodType, MoodEntry, JournalEntry, ConversationSession } from '../lib/types';
import { useToast } from '@/hooks/use-toast';
import { UserData } from './types';
import * as userService from '../services/userService';
import * as moodService from '../services/moodService';
import * as journalService from '../services/journalService';
import * as conversationService from '../services/conversationService';

const UserDataContext = createContext<UserData | undefined>(undefined);

interface UserDataProviderProps {
  children: React.ReactNode;
}

const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(null);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const { toast } = useToast();

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
    setLoading(true);
    try {
      const userData = await userService.fetchUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "Error fetching user",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setLoading(true);
    try {
      const profileData = await userService.fetchProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to save your profile.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const updatedProfile = await userService.saveProfile(user.id, profileData);
      setProfile(updatedProfile);
      toast({
        title: "Profile saved",
        description: "Your profile has been updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMoodEntries = async () => {
    try {
      if (user) {
        const entries = await moodService.fetchMoodEntries(user.id);
        setMoodEntries(entries);
      }
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    }
  };

  const addMoodEntry = async (mood: MoodType, note?: string) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to save your mood.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newEntry = await moodService.addMoodEntry(user.id, mood, note);
      if (newEntry) {
        setMoodEntries(prev => [newEntry, ...prev]);
        toast({
          title: "Mood saved",
          description: "Your mood has been recorded.",
        });
      }
    } catch (error) {
      console.error('Error adding mood entry:', error);
      toast({
        title: "Error saving mood",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const fetchJournalEntries = async () => {
    try {
      if (user) {
        const entries = await journalService.fetchJournalEntries(user.id);
        setJournalEntries(entries);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const startConversation = async (type: 'story' | 'sideQuest' | 'action' | 'journal'): Promise<ConversationSession> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      return await conversationService.startConversation(user.id, type);
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<void> => {
    try {
      await conversationService.addMessageToConversation(conversationId, content, role, user?.id);
      
      // If it's a journal entry and from assistant, refresh journal entries
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
