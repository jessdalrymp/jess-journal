
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/context/UserDataContext";
import { JournalPrompt, DEFAULT_PROMPT } from './types';
import { generateStandardJournalPrompt, generatePersonalizedPrompt } from './promptGenerator';

export const useJournalPrompt = () => {
  const [journalPrompt, setJournalPrompt] = useState<JournalPrompt>(DEFAULT_PROMPT);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const [usePersonalized, setUsePersonalized] = useState(false);
  const generationInProgress = useRef(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { journalEntries } = useUserData();

  // Set usePersonalized when entries are available - only once
  useEffect(() => {
    if (journalEntries && journalEntries.length > 2 && !usePersonalized) {
      setUsePersonalized(true);
    }
  }, [journalEntries, usePersonalized]);

  // Generate prompt only once on initial load
  useEffect(() => {
    if (user && !challengeAccepted && !isLoading && !generationInProgress.current) {
      generateNewPrompt();
    }
  }, [user, challengeAccepted]);

  const generateNewPrompt = useCallback(async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate a new writing challenge",
        variant: "destructive"
      });
      return;
    }

    // Prevent multiple simultaneous generations
    if (generationInProgress.current) {
      console.log('Prompt generation already in progress, skipping duplicate request');
      return;
    }

    setChallengeAccepted(false);
    setIsLoading(true);
    generationInProgress.current = true;
    
    try {
      let newPrompt: JournalPrompt | null = null;
      
      // Use personalized prompt if applicable
      if (usePersonalized && journalEntries && journalEntries.length > 2) {
        newPrompt = await generatePersonalizedPrompt(user.id);
      }
      
      // Fallback to standard prompt
      if (!newPrompt) {
        newPrompt = await generateStandardJournalPrompt();
      }
      
      if (newPrompt) {
        setJournalPrompt(newPrompt);
      } else {
        toast({
          title: "Error generating journal prompt",
          description: "Could not create a new writing prompt. Using default prompt instead.",
          variant: "destructive"
        });
        setJournalPrompt(DEFAULT_PROMPT);
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
      generationInProgress.current = false;
    }
  }, [user, usePersonalized, journalEntries, toast]);

  const togglePersonalizedPrompts = useCallback(() => {
    setUsePersonalized(prev => {
      const newValue = !prev;
      // Only generate new prompt when turning personalization on
      if (newValue && !generationInProgress.current) {
        generateNewPrompt();
      }
      return newValue;
    });
  }, [generateNewPrompt]);

  const acceptChallenge = useCallback(() => {
    setChallengeAccepted(true);
  }, []);

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
