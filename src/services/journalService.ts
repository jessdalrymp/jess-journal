
import { JournalEntry } from '../lib/types';
import { supabase } from '../integrations/supabase/client';
import * as CryptoJS from 'crypto-js';

// Helper function to encrypt content using AES
const encryptContent = (content: string, userId: string): string => {
  // Use the userId as part of the encryption key for user-specific encryption
  const encryptionKey = `jess_journal_${userId}`;
  return CryptoJS.AES.encrypt(content, encryptionKey).toString();
};

// Helper function to decrypt content
const decryptContent = (encryptedContent: string, userId: string): string => {
  try {
    const encryptionKey = `jess_journal_${userId}`;
    const bytes = CryptoJS.AES.decrypt(encryptedContent, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting content:', error);
    return encryptedContent; // Return original content if decryption fails
  }
};

// Helper function to parse content that might be JSON in a code block
const parseContentWithJsonCodeBlock = (content: string) => {
  try {
    // First, try to detect if this is a JSON string inside code blocks
    let contentToProcess = content;
    
    // Remove code block markers if present
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const match = content.match(jsonRegex);
    if (match && match[1]) {
      contentToProcess = match[1].trim();
    }
    
    // Try to parse as JSON
    const parsed = JSON.parse(contentToProcess);
    return parsed;
  } catch (e) {
    // If parsing fails, return null
    return null;
  }
};

export const fetchJournalEntries = async (userId: string | undefined): Promise<JournalEntry[]> => {
  if (!userId) return [];

  try {
    console.log('Fetching journal entries for user:', userId);
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No journal entries found for user:', userId);
      return [];
    }
    
    console.log(`Found ${data.length} journal entries`);

    const entries: JournalEntry[] = data.map(entry => {
      // Decrypt the content before processing
      const decryptedContent = decryptContent(entry.content, userId);
      
      // Try to parse the content as JSON
      const parsedContent = parseContentWithJsonCodeBlock(decryptedContent);
      
      // Use the parsed title if available, otherwise use the prompt
      const title = parsedContent && parsedContent.title 
        ? parsedContent.title 
        : entry.prompt.substring(0, 50) + (entry.prompt.length > 50 ? '...' : '');

      // Determine the entry type
      let entryType = entry.type || 'journal';
      if (parsedContent && parsedContent.type) {
        entryType = parsedContent.type;
      }

      return {
        id: entry.id,
        userId: entry.user_id,
        title: title,
        content: decryptedContent,
        type: entryType as 'journal' | 'story' | 'sideQuest' | 'action',
        createdAt: new Date(entry.created_at)
      };
    });
    
    return entries;
  } catch (error) {
    console.error('Error processing journal entries:', error);
    return [];
  }
};

export const saveJournalEntry = async (
  userId: string | undefined, 
  prompt: string, 
  content: string,
  type = 'journal'
): Promise<JournalEntry | null> => {
  if (!userId) return null;

  try {
    // Encrypt the content before saving
    const encryptedContent = encryptContent(content, userId);
    
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt,
        content: encryptedContent,
        type
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving journal entry:', error);
      return null;
    }

    // Use the decrypted content for the returned entry
    const decryptedContent = decryptContent(data.content, userId);

    // Try to parse content to get title
    const parsedContent = parseContentWithJsonCodeBlock(decryptedContent);
    const title = parsedContent && parsedContent.title 
      ? parsedContent.title 
      : data.prompt.substring(0, 50) + (data.prompt.length > 50 ? '...' : '');

    // Determine the entry type
    let entryType = data.type || 'journal';
    if (parsedContent && parsedContent.type) {
      entryType = parsedContent.type;
    }

    const newEntry: JournalEntry = {
      id: data.id,
      userId: data.user_id,
      title: title,
      content: decryptedContent,
      type: entryType as 'journal' | 'story' | 'sideQuest' | 'action',
      createdAt: new Date(data.created_at)
    };

    return newEntry;
  } catch (error) {
    console.error('Error processing journal entry:', error);
    return null;
  }
};

export const updateJournalEntry = async (entryId: string, content: string, userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Encrypt the content before updating
    const encryptedContent = encryptContent(content, userId);
    
    const { error } = await supabase
      .from('journal_entries')
      .update({ content: encryptedContent })
      .eq('id', entryId);

    if (error) {
      console.error('Error updating journal entry:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return false;
  }
};

export const deleteJournalEntry = async (entryId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Error deleting journal entry:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return false;
  }
};
