
import { supabase } from '../integrations/supabase/client';
import { JournalPrompt } from '../components/journal/JournalChallengeContent';

export type SavedPrompt = {
  id: string;
  userId: string;
  prompt: JournalPrompt;
  createdAt: Date;
  favorite: boolean;
};

// Fetch saved prompts for a user
export const fetchSavedPrompts = async (userId: string): Promise<SavedPrompt[]> => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('saved_prompts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching saved prompts:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      prompt: item.prompt_data as JournalPrompt, // Use type assertion instead of JSON.parse
      createdAt: new Date(item.created_at),
      favorite: item.favorite || false
    }));
  } catch (error) {
    console.error('Error processing saved prompts:', error);
    return [];
  }
};

// Save a prompt for a user
export const savePrompt = async (userId: string, prompt: JournalPrompt): Promise<SavedPrompt | null> => {
  if (!userId) return null;
  
  try {
    // First check if this prompt is already saved - using a simpler query to avoid excessive type instantiation
    const { data: existingData, error: checkError } = await supabase
      .from('saved_prompts')
      .select('id')
      .eq('user_id', userId)
      .contains('prompt_data', { title: prompt.title });
    
    if (checkError) {
      console.error('Error checking for existing prompt:', checkError);
    }
    
    if (existingData && existingData.length > 0) {
      // Prompt already exists
      console.log('Prompt already saved');
      return null;
    }
    
    const { data, error } = await supabase
      .from('saved_prompts')
      .insert({
        user_id: userId,
        prompt_data: prompt, // Send as object, Supabase will handle JSONB conversion
        favorite: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving prompt:', error);
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      prompt: data.prompt_data as JournalPrompt, // Use type assertion instead of JSON.parse
      createdAt: new Date(data.created_at),
      favorite: data.favorite || false
    };
  } catch (error) {
    console.error('Error saving prompt:', error);
    return null;
  }
};

// Toggle favorite status of a prompt
export const toggleFavoritePrompt = async (promptId: string): Promise<boolean> => {
  try {
    // First get current favorite status
    const { data: currentData, error: fetchError } = await supabase
      .from('saved_prompts')
      .select('favorite')
      .eq('id', promptId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching prompt favorite status:', fetchError);
      return false;
    }
    
    const newFavoriteStatus = !(currentData.favorite || false);
    
    const { error } = await supabase
      .from('saved_prompts')
      .update({ favorite: newFavoriteStatus })
      .eq('id', promptId);
    
    if (error) {
      console.error('Error updating prompt favorite status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    return false;
  }
};

// Delete a saved prompt
export const deleteSavedPrompt = async (promptId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_prompts')
      .delete()
      .eq('id', promptId);
    
    if (error) {
      console.error('Error deleting saved prompt:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting saved prompt:', error);
    return false;
  }
};
