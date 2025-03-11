
import { useState, useEffect } from "react";
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
      generateNewPrompt();
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
      let newPrompt: JournalPrompt | null = null;
      
      // Use personalized prompt if user has enough entries and we're set to use personalized
      if (usePersonalized && journalEntries && journalEntries.length > 2) {
        newPrompt = await generatePersonalizedPrompt(user.id);
      }
      
      // If personalized prompt failed or not applicable, use regular generation
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
