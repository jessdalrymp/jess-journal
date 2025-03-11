
import { useState, useEffect } from 'react';
import { JournalPrompt } from '../components/journal/JournalChallengeContent';
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';
import { useToast } from '@/hooks/use-toast';
import { generateDeepseekResponse, extractDeepseekResponseText, generatePersonalizedJournalPrompt } from '../utils/deepseekApi';
import { savePrompt, SavedPrompt } from '../services/savedPromptsService';

export const useJournalPrompt = () => {
  const [journalPrompt, setJournalPrompt] = useState<JournalPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usePersonalized, setUsePersonalized] = useState(false);
  const [promptSaved, setPromptSaved] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { journalEntries } = useUserData();

  // Check if we have enough entries for personalized prompts
  useEffect(() => {
    if (journalEntries && journalEntries.length > 2) {
      setUsePersonalized(true);
    }
  }, [journalEntries]);

  // Load saved prompt from localStorage on initial load
  useEffect(() => {
    if (user) {
      const savedPromptJson = localStorage.getItem('currentJournalPrompt');
      if (savedPromptJson) {
        try {
          setJournalPrompt(JSON.parse(savedPromptJson));
        } catch (e) {
          generateNewChallenge();
        }
      } else {
        generateNewChallenge();
      }
    }
  }, [user]);

  const generateNewChallenge = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate a new writing challenge",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setPromptSaved(false);
    
    try {
      let newPrompt;
      
      if (usePersonalized && journalEntries && journalEntries.length > 2) {
        const personalizedPromptText = await generatePersonalizedJournalPrompt(user.id);
        
        const systemPrompt = `You are Jess, an AI life coach specializing in creating personalized writing prompts.
        Here is a personalized journal prompt: "${personalizedPromptText}"
        
        Format this prompt into a structured journaling exercise that follows this exact JSON format:
        
        {
          "title": "Short, engaging title for the journaling exercise",
          "prompt": "${personalizedPromptText}",
          "instructions": [
            "Step 1 instruction for completing the journaling exercise",
            "Step 2 instruction for completing the journaling exercise",
            "Step 3 instruction for completing the journaling exercise",
            "Step 4 instruction for completing the journaling exercise"
          ]
        }
        
        ONLY return valid JSON. No other text.`;

        const response = await generateDeepseekResponse([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Format this personalized prompt into a structured journal challenge' }
        ]);
        
        const rawText = extractDeepseekResponseText(response);
        
        try {
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            newPrompt = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Could not parse personalized journal prompt JSON");
          }
        } catch (jsonError) {
          console.error("Failed to parse personalized journal prompt:", jsonError);
          newPrompt = null;
        }
      }
      
      if (!newPrompt) {
        const systemPrompt = `You are Jess, an AI life coach specializing in creating personalized writing prompts and journaling exercises.
        Create a unique, reflective journaling prompt that will help users gain insights into their thought patterns, behaviors, and growth.
        
        Your response must follow this exact format:
        
        {
          "title": "Short, engaging title for the journaling exercise",
          "prompt": "A thought-provoking question or statement that encourages deep reflection",
          "instructions": [
            "Step 1 instruction for completing the journaling exercise",
            "Step 2 instruction for completing the journaling exercise",
            "Step 3 instruction for completing the journaling exercise",
            "Step 4 instruction for completing the journaling exercise"
          ]
        }
        
        The prompt should:
        - Encourage self-reflection and awareness
        - Be specific enough to provide direction but open enough for personal interpretation
        - Connect to common human experiences and emotions
        - Avoid clichés and overly simplistic advice
        
        ONLY return valid JSON. No other text.`;

        const response = await generateDeepseekResponse([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate a new journaling challenge for me that will help me reflect on my growth and patterns' }
        ]);

        const rawText = extractDeepseekResponseText(response);
        
        try {
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            newPrompt = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Could not parse journal prompt JSON");
          }
        } catch (jsonError) {
          console.error("Failed to parse journal prompt:", jsonError);
          toast({
            title: "Error generating journal prompt",
            description: "Could not create a new writing prompt. Using default prompt instead.",
            variant: "destructive"
          });
        }
      }
      
      if (newPrompt) {
        localStorage.setItem('currentJournalPrompt', JSON.stringify(newPrompt));
        setJournalPrompt(newPrompt);
      }
    } catch (error) {
      console.error("Error generating journal prompt:", error);
      toast({
        title: "Error generating journal prompt",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrompt = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save this prompt",
        variant: "destructive"
      });
      return;
    }

    try {
      if (journalPrompt) {
        const result = await savePrompt(user.id, journalPrompt);
        if (result) {
          setPromptSaved(true);
          toast({
            title: "Prompt saved",
            description: "You can access it from your saved prompts"
          });
        } else {
          toast({
            title: "Already saved",
            description: "This prompt has already been saved"
          });
          setPromptSaved(true);
        }
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast({
        title: "Error saving prompt",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleSelectSavedPrompt = (savedPrompt: SavedPrompt) => {
    setJournalPrompt(savedPrompt.prompt);
    localStorage.setItem('currentJournalPrompt', JSON.stringify(savedPrompt.prompt));
    setPromptSaved(true);
  };

  const togglePersonalizedPrompts = () => {
    setUsePersonalized(!usePersonalized);
    if (!usePersonalized) {
      generateNewChallenge();
    }
  };

  return {
    journalPrompt,
    isLoading,
    promptSaved,
    usePersonalized,
    hasEnoughEntries: journalEntries && journalEntries.length > 2,
    generateNewChallenge,
    handleSavePrompt,
    handleSelectSavedPrompt,
    togglePersonalizedPrompts
  };
};
