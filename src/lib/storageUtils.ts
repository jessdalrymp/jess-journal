/**
 * Utility functions for interacting with localStorage
 */

import { 
  UserProfile,
  JournalEntry,
  ActionChallenge,
  ConversationSession,
  ChatMessage
} from './types';

export const getProfileFromStorage = (): UserProfile | null => {
  try {
    const storedProfile = localStorage.getItem('userProfile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  } catch (error) {
    console.error('Error loading profile from storage:', error);
    return null;
  }
};

export const saveProfileToStorage = (profile: UserProfile): void => {
  try {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile to storage:', error);
  }
};

export const getJournalEntriesFromStorage = (): JournalEntry[] => {
  try {
    const storedEntries = localStorage.getItem('journalEntries');
    return storedEntries ? JSON.parse(storedEntries) : [];
  } catch (error) {
    console.error('Error loading journal entries from storage:', error);
    return [];
  }
};

export const saveJournalEntriesToStorage = (entries: JournalEntry[]): void => {
  try {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving journal entries to storage:', error);
  }
};

export const getChallengesFromStorage = (): ActionChallenge[] => {
  try {
    const storedChallenges = localStorage.getItem('actionChallenges');
    return storedChallenges ? JSON.parse(storedChallenges) : [];
  } catch (error) {
    console.error('Error loading challenges from storage:', error);
    return [];
  }
};

export const saveChallengesToStorage = (challenges: ActionChallenge[]): void => {
  try {
    localStorage.setItem('actionChallenges', JSON.stringify(challenges));
  } catch (error) {
    console.error('Error saving challenges to storage:', error);
  }
};

/**
 * Get conversations from local storage
 */
export const getConversationsFromStorage = (): any[] => {
  try {
    const stored = localStorage.getItem('conversations');
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error getting conversations from storage:', error);
    return [];
  }
};

/**
 * Save conversations to local storage
 */
export const saveConversationsToStorage = (conversations: any[]): void => {
  try {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversations to storage:', error);
  }
};

/**
 * Get current conversation from local storage
 */
export const getCurrentConversationFromStorage = (type: 'story' | 'sideQuest' | 'action' | 'journal'): any => {
  try {
    const key = `current_${type}_conversation`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error(`Error getting current ${type} conversation from storage:`, error);
    return null;
  }
};

/**
 * Save current conversation to local storage
 */
export const saveCurrentConversationToStorage = (conversation: any): void => {
  try {
    if (!conversation || !conversation.type) {
      console.error('Cannot save conversation: Missing type or invalid conversation object', conversation);
      return;
    }
    
    const key = `current_${conversation.type}_conversation`;
    console.log(`Saving conversation to localStorage with key: ${key}`, conversation);
    localStorage.setItem(key, JSON.stringify(conversation));
  } catch (error) {
    console.error('Error saving current conversation to storage:', error);
  }
};

/**
 * Clear current conversation from local storage
 */
export const clearCurrentConversationFromStorage = (type: 'story' | 'sideQuest' | 'action' | 'journal'): void => {
  try {
    const key = `current_${type}_conversation`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing current ${type} conversation from storage:`, error);
  }
};
