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
      const storedProfile = getProfileFromStorage();
      if (storedProfile && storedProfile.userId === user.id) {
        setProfile(storedProfile);
        console.log("Profile loaded from local storage");
        return;
      }

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
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
      saveProfileToStorage(userProfile);
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
      saveProfileToStorage(updatedProfile);
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

  const startConversation = async (type: 'story' | 'sideQuest' | 'action' | 'journal'): Promise<ConversationSession> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const { data: existingConversations, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', type)
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (fetchError) {
        console.error('Error fetching conversations:', fetchError);
        throw fetchError;
      }
      
      if (existingConversations && existingConversations.length > 0) {
        const existingConv = existingConversations[0];
        
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', existingConv.id)
          .order('timestamp', { ascending: true });
        
        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          throw messagesError;
        }
        
        const messages: ChatMessage[] = messagesData ? messagesData.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        })) : [];
        
        return {
          id: existingConv.id,
          userId: existingConv.user_id,
          type: existingConv.type as 'story' | 'sideQuest' | 'action' | 'journal',
          title: existingConv.title,
          messages: messages,
          summary: existingConv.summary || undefined,
          createdAt: new Date(existingConv.created_at),
          updatedAt: new Date(existingConv.updated_at)
        };
      }
      
      const newConversationData = {
        user_id: user.id,
        type,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Conversation`,
      };
      
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert(newConversationData)
        .select()
        .single();
      
      if (createError || !newConversation) {
        console.error('Error creating conversation:', createError);
        throw createError || new Error('Failed to create conversation');
      }
      
      return {
        id: newConversation.id,
        userId: newConversation.user_id,
        type: newConversation.type as 'story' | 'sideQuest' | 'action' | 'journal',
        title: newConversation.title,
        messages: [],
        summary: newConversation.summary || undefined,
        createdAt: new Date(newConversation.created_at),
        updatedAt: new Date(newConversation.updated_at)
      };
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<void> => {
    try {
      const newMessageData = {
        conversation_id: conversationId,
        content,
        role
      };
      
      const { error: messageError } = await supabase
        .from('messages')
        .insert(newMessageData);
      
      if (messageError) {
        console.error('Error adding message:', messageError);
        throw messageError;
      }
      
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      if (updateError) {
        console.error('Error updating conversation timestamp:', updateError);
        throw updateError;
      }
      
      const { data: conversationData, error: fetchError } = await supabase
        .from('conversations')
        .select('type')
        .eq('id', conversationId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching conversation type:', fetchError);
        return;
      }
      
      if (conversationData.type === 'journal' && role === 'assistant') {
        const { data: userMessages, error: userMessagesError } = await supabase
          .from('messages')
          .select('content')
          .eq('conversation_id', conversationId)
          .eq('role', 'user')
          .order('timestamp', { ascending: false })
          .limit(1);
        
        if (userMessagesError || !userMessages || userMessages.length === 0) {
          console.error('Error fetching user messages:', userMessagesError);
          return;
        }
        
        const prompt = userMessages[0].content;
        saveJournalEntry(prompt, content);
      }
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      throw error;
    }
  };

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
