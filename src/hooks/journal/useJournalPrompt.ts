
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/context/UserDataContext";
import { JournalPrompt, DEFAULT_PROMPT } from './types';
import { generateStandardJournalPrompt, generatePersonalizedPrompt } from './promptGenerator';

// Create a static cache for prompts to persist between component mounts
const promptCache = {
  standard: null as JournalPrompt | null,
  personalized: new Map<string, JournalPrompt>(),
  timestamp: 0
};

// Cache expiry time (1 hour)
const CACHE_EXPIRY = 60 * 60 * 1000;

export const useJournalPrompt = () => {
  const [journalPrompt, setJournalPrompt] = useState<JournalPrompt>(() => {
    // Try to get the prompt from localStorage on initialization for quick initial render
    try {
      const storedPrompt = localStorage.getItem('currentJournalPrompt');
      if (storedPrompt) {
        return JSON.parse(storedPrompt) as JournalPrompt;
      }
    } catch (e) {
      console.error('Error parsing stored prompt:', e);
    }
    return DEFAULT_PROMPT;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const [usePersonalized, setUsePersonalized] = useState(false);
  const [initialPromptLoaded, setInitialPromptLoaded] = useState(false);
  const generationInProgress = useRef(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { journalEntries } = useUserData();

  // Check cache validity
  const isCacheValid = () => {
    return (Date.now() - promptCache.timestamp) < CACHE_EXPIRY;
  };

  // Set usePersonalized when entries are available - only once
  useEffect(() => {
    if (journalEntries && journalEntries.length > 2 && !usePersonalized) {
      setUsePersonalized(true);
    }
  }, [journalEntries, usePersonalized]);

  // Load a prompt only on initial load if needed
  useEffect(() => {
    // If we already have a prompt from localStorage or have already loaded one, don't load another
    if (initialPromptLoaded || !user || challengeAccepted || generationInProgress.current || 
        (journalPrompt !== DEFAULT_PROMPT)) {
      return;
    }

    setInitialPromptLoaded(true);
    
    // Only set loading if we don't already have a valid prompt
    if (journalPrompt === DEFAULT_PROMPT) {
      setIsLoading(true);
    }

    // Try to use cached prompts first
    if (isCacheValid()) {
      if (usePersonalized && user.id && promptCache.personalized.has(user.id)) {
        const cachedPrompt = promptCache.personalized.get(user.id);
        if (cachedPrompt) {
          setJournalPrompt(cachedPrompt);
          setIsLoading(false);
          localStorage.setItem('currentJournalPrompt', JSON.stringify(cachedPrompt));
          return;
        }
      } else if (!usePersonalized && promptCache.standard) {
        setJournalPrompt(promptCache.standard);
        setIsLoading(false);
        localStorage.setItem('currentJournalPrompt', JSON.stringify(promptCache.standard));
        return;
      }
    }

    // If we don't have a cached prompt, generate a new one asynchronously
    // This will run in parallel to any render, so the UI won't be blocked
    setTimeout(() => generateNewPrompt(), 0);
  }, [user, challengeAccepted, journalPrompt]);

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
    setIsGeneratingPrompt(true);
    generationInProgress.current = true;
    
    try {
      let newPrompt: JournalPrompt | null = null;
      
      // When generating a new prompt, we should explicitly invalidate the cache
      // to ensure we get a fresh prompt every time the user clicks "New Prompt"
      if (usePersonalized && journalEntries && journalEntries.length > 2) {
        console.log('Generating personalized prompt');
        newPrompt = await generatePersonalizedPrompt(user.id);
        
        // Cache the personalized prompt
        if (newPrompt) {
          promptCache.personalized.set(user.id, newPrompt);
          promptCache.timestamp = Date.now();
        }
      } else {
        console.log('Generating standard prompt');
        newPrompt = await generateStandardJournalPrompt();
        
        // Cache the standard prompt
        if (newPrompt) {
          promptCache.standard = newPrompt;
          promptCache.timestamp = Date.now();
        }
      }
      
      if (newPrompt) {
        setJournalPrompt(newPrompt);
        // Update localStorage for quick loading next time
        localStorage.setItem('currentJournalPrompt', JSON.stringify(newPrompt));
      } else {
        toast({
          title: "Using default prompt",
          description: "We're having trouble generating a custom prompt right now.",
          variant: "default"
        });
        setJournalPrompt(DEFAULT_PROMPT);
      }
    } catch (error) {
      console.error("Error generating journal prompt:", error);
      toast({
        title: "Error generating journal prompt",
        description: "Using a default prompt instead.",
        variant: "destructive"
      });
      setJournalPrompt(DEFAULT_PROMPT);
    } finally {
      setIsLoading(false);
      setIsGeneratingPrompt(false);
      generationInProgress.current = false;
    }
  }, [user, usePersonalized, journalEntries, toast]);

  const togglePersonalizedPrompts = useCallback(() => {
    // Immediately update the state - the UI will respond to this
    setUsePersonalized(prev => !prev);
    
    // Generate a new prompt based on the new state in the next tick
    setTimeout(() => {
      console.log('Toggled personalized prompts, generating new prompt');
      generateNewPrompt();
    }, 0);
  }, [generateNewPrompt]);

  const acceptChallenge = useCallback(() => {
    setChallengeAccepted(true);
  }, []);

  return {
    journalPrompt,
    isLoading,
    isGeneratingPrompt,
    challengeAccepted,
    usePersonalized,
    hasEnoughEntries: journalEntries && journalEntries.length > 2,
    generateNewPrompt,
    togglePersonalizedPrompts,
    acceptChallenge,
    setChallengeAccepted
  };
};
