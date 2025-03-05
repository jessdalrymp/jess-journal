
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, UserProfile, ConversationSession, ChatMessage, JournalEntry, MoodType, MoodEntry } from '../lib/types';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getProfileFromStorage, saveProfileToStorage } from '../lib/storageUtils';

interface UserData {
  user: User | null | undefined;
  profile: UserProfile | null | undefined;
  loading: boolean;
  fetchUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  saveProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  startConversation: (type: 'story' | 'sideQuest' | 'action' | 'journal') => Promise<ConversationSession>;
  addMessageToConversation: (conversationId: string, content: string, role: 'user' | 'assistant') => Promise<void>;
  moodEntries: MoodEntry[];
  addMoodEntry: (mood: MoodType, note?: string) => Promise<void>;
  journalEntries: JournalEntry[];
}

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
    fetchProfile();
    fetchMoodEntries();
    fetchJournalEntries();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        // Convert Supabase user to our User type
        const userData: User = {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name,
          createdAt: new Date(authUser.created_at || Date.now())
        };
        setUser(userData);
      } else {
        setUser(null);
      }
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
      // First, try to get the profile from local storage
      const storedProfile = getProfileFromStorage();
      if (storedProfile && storedProfile.userId === user.id) {
        setProfile(storedProfile);
        console.log("Profile loaded from local storage");
        return;
      }

      // If not in local storage, fetch from Supabase
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
        // If profile doesn't exist, that's okay, we'll create it later
        if (error.code !== 'PGRST116') {
          toast({
            title: "Error fetching profile",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
        setProfile(null);
        return;
      }

      // Convert Supabase profile to our UserProfile type
      const userProfile: UserProfile = {
        id: profileData.id,
        userId: user.id,
        growthStage: profileData.growth_stage || undefined,
        challenges: profileData.goals || undefined,
        mindsetPatterns: undefined,
        learningStyle: profileData.learning_style || undefined,
        supportNeeds: undefined,
        communicationPreference: profileData.communication_style || undefined,
        engagementMode: undefined,
        completedOnboarding: profileData.assessment_completed || false
      };
      
      setProfile(userProfile);
      saveProfileToStorage(userProfile); // Save to local storage
      console.log("Profile loaded from Supabase");
    } catch (error) {
      console.error('Error processing profile data:', error);
      toast({
        title: "Error processing profile",
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
      const currentProfile = profile || { 
        id: user.id,
        userId: user.id,
        completedOnboarding: false 
      };
      const updatedProfile = { ...currentProfile, ...profileData };

      // Convert our UserProfile type to Supabase profile format
      const supabaseProfileData = {
        id: user.id,
        growth_stage: updatedProfile.growthStage,
        goals: updatedProfile.challenges,
        learning_style: updatedProfile.learningStyle,
        communication_style: updatedProfile.communicationPreference,
        assessment_completed: updatedProfile.completedOnboarding,
        email: user.email
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(supabaseProfileData, { onConflict: 'id' });

      if (error) {
        console.error('Error saving profile:', error);
        toast({
          title: "Error saving profile",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      setProfile(updatedProfile);
      saveProfileToStorage(updatedProfile); // Save to local storage
      console.log("Profile saved successfully");
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

  // Fetch mood entries
  const fetchMoodEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mood entries:', error);
        return;
      }

      if (data) {
        const entries: MoodEntry[] = data.map(entry => ({
          id: entry.id,
          userId: entry.user_id,
          mood: entry.mood as MoodType,
          note: entry.note || undefined,
          createdAt: new Date(entry.created_at)
        }));
        setMoodEntries(entries);
      }
    } catch (error) {
      console.error('Error processing mood entries:', error);
    }
  };

  // Add new mood entry
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
      const newEntry = {
        user_id: user.id,
        mood,
        note
      };

      const { data, error } = await supabase
        .from('mood_entries')
        .insert(newEntry)
        .select()
        .single();

      if (error) {
        console.error('Error adding mood entry:', error);
        toast({
          title: "Error saving mood",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      // Add the new entry to the state
      const newMoodEntry: MoodEntry = {
        id: data.id,
        userId: data.user_id,
        mood: data.mood as MoodType,
        note: data.note || undefined,
        createdAt: new Date(data.created_at)
      };

      setMoodEntries(prev => [newMoodEntry, ...prev]);
      
      toast({
        title: "Mood saved",
        description: "Your mood has been recorded.",
      });
    } catch (error) {
      console.error('Error processing mood entry:', error);
      toast({
        title: "Error saving mood",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Fetch journal entries
  const fetchJournalEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching journal entries:', error);
        return;
      }

      if (data) {
        const entries: JournalEntry[] = data.map(entry => ({
          id: entry.id,
          userId: entry.user_id,
          title: entry.prompt.substring(0, 50) + (entry.prompt.length > 50 ? '...' : ''),
          content: entry.content,
          type: 'journal',
          createdAt: new Date(entry.created_at)
        }));
        setJournalEntries(entries);
      }
    } catch (error) {
      console.error('Error processing journal entries:', error);
    }
  };

  // Start a new conversation or return an existing one
  const startConversation = async (type: 'story' | 'sideQuest' | 'action' | 'journal'): Promise<ConversationSession> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      // Try to get existing conversations from local storage
      const storedConversations = localStorage.getItem('conversations');
      let conversations: ConversationSession[] = [];
      
      if (storedConversations) {
        conversations = JSON.parse(storedConversations);
        // Find if there's an existing conversation of this type
        const existingConversation = conversations.find(c => c.type === type);
        
        if (existingConversation) {
          return existingConversation;
        }
      }
      
      // Create a new conversation
      const newConversation: ConversationSession = {
        id: generateId(),
        userId: user.id,
        type,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Conversation`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save to local storage
      conversations.push(newConversation);
      localStorage.setItem('conversations', JSON.stringify(conversations));
      
      return newConversation;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  };

  // Add a message to a conversation
  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<void> => {
    try {
      // Get conversations from local storage
      const storedConversations = localStorage.getItem('conversations');
      if (!storedConversations) {
        throw new Error("No conversations found");
      }
      
      const conversations: ConversationSession[] = JSON.parse(storedConversations);
      const conversationIndex = conversations.findIndex(c => c.id === conversationId);
      
      if (conversationIndex === -1) {
        throw new Error("Conversation not found");
      }
      
      // Add the new message
      const newMessage: ChatMessage = {
        id: generateId(),
        role,
        content,
        timestamp: new Date()
      };
      
      conversations[conversationIndex].messages.push(newMessage);
      conversations[conversationIndex].updatedAt = new Date();
      
      // Save back to local storage
      localStorage.setItem('conversations', JSON.stringify(conversations));
      
      // If this is a journal entry and from the assistant, save it to the journal
      if (conversations[conversationIndex].type === 'journal' && role === 'assistant') {
        // Get the last user message as the prompt
        const userMessages = conversations[conversationIndex].messages.filter(m => m.role === 'user');
        if (userMessages.length > 0) {
          const prompt = userMessages[userMessages.length - 1].content;
          saveJournalEntry(prompt, content);
        }
      }
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      throw error;
    }
  };

  // Save a journal entry
  const saveJournalEntry = async (prompt: string, content: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          prompt,
          content
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving journal entry:', error);
        return;
      }

      // Add to local state
      const newEntry: JournalEntry = {
        id: data.id,
        userId: data.user_id,
        title: data.prompt.substring(0, 50) + (data.prompt.length > 50 ? '...' : ''),
        content: data.content,
        type: 'journal',
        createdAt: new Date(data.created_at)
      };

      setJournalEntries(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error('Error processing journal entry:', error);
    }
  };

  // Helper function to generate unique IDs
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
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
