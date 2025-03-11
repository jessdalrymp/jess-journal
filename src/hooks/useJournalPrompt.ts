
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/context/UserDataContext";
import { generateDeepseekResponse, extractDeepseekResponseText, generatePersonalizedJournalPrompt } from "../utils/deepseekApi";

export type JournalPrompt = {
  title: string;
  prompt: string;
  instructions: string[];
};

export const DEFAULT_PROMPT: JournalPrompt = {
  title: "Reflecting on Your Growth Journey",
  prompt: "What patterns have you noticed in how you respond to challenges? How has your perspective shifted over time?",
  instructions: [
    "Take 10 minutes to freely write about your thoughts and feelings on this topic",
    "Focus on specific examples from your past that illustrate your growth",
    "Consider how your current perspective differs from your past self",
    "Reflect on what these changes reveal about your personal development"
  ]
};

export const useJournalPrompt = () => {
  const [journalPrompt, setJournalPrompt] = useState<JournalPrompt>(DEFAULT_PROMPT);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const [usePersonalized, setUsePersonalized] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { journalEntries } = useUserData();

  useEffect(() => {
    // If user has journal entries, use personalized prompts
    if (journalEntries && journalEntries.length > 2) {
      setUsePersonalized(true);
    }
  }, [journalEntries]);

  useEffect(() => {
    // Generate a journal prompt when the component mounts if the user is authenticated and no challenge is accepted
    if (user && !challengeAccepted) {
      // Check localStorage first
      const savedPrompt = localStorage.getItem('currentJournalPrompt');
      if (savedPrompt) {
        try {
          setJournalPrompt(JSON.parse(savedPrompt));
        } catch (e) {
          generateNewPrompt();
        }
      } else {
        generateNewPrompt();
      }
    }
  }, [user, challengeAccepted]);

  const generateNewPrompt = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate a new writing challenge",
        variant: "destructive"
      });
      return;
    }

    setChallengeAccepted(false);
    setIsLoading(true);
    try {
      let newPrompt;
      
      // Use personalized prompt if user has enough entries and we're set to use personalized
      if (usePersonalized && journalEntries && journalEntries.length > 2) {
        const personalizedPromptText = await generatePersonalizedJournalPrompt(user.id);
        
        // Format the personalized prompt in the standard format
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
          // Extract JSON from the response
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            newPrompt = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Could not parse personalized journal prompt JSON");
          }
        } catch (jsonError) {
          console.error("Failed to parse personalized journal prompt:", jsonError);
          // Fall back to regular prompt generation
          newPrompt = null;
        }
      }
      
      // If personalized prompt failed or not applicable, use regular generation
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
          // Extract JSON from the response (in case there's any extra text)
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
        // Store the prompt in localStorage for chat context
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

  const togglePersonalizedPrompts = () => {
    setUsePersonalized(!usePersonalized);
    // If turning on personalized prompts, generate a new one
    if (!usePersonalized) {
      generateNewPrompt();
    }
  };

  const acceptChallenge = () => {
    setChallengeAccepted(true);
  };

  return {
    journalPrompt,
    isLoading,
    challengeAccepted,
    usePersonalized,
    hasEnoughEntries: journalEntries && journalEntries.length > 2,
    generateNewPrompt,
    togglePersonalizedPrompts,
    acceptChallenge,
    setChallengeAccepted
  };
};
