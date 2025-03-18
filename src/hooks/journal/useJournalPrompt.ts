
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
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const [usePersonalized, setUsePersonalized] = useState(false);
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

  // Generate prompt only once on initial load with caching
  useEffect(() => {
    if (!user || challengeAccepted || generationInProgress.current) {
      return;
    }

    // Only set loading if we don't already have a prompt from localStorage
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
  }, [user, challengeAccepted, usePersonalized]);

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
      
      // First check if we have a valid cached prompt
      if (isCacheValid()) {
        if (usePersonalized && promptCache.personalized.has(user.id)) {
          newPrompt = promptCache.personalized.get(user.id) || null;
        } else if (!usePersonalized && promptCache.standard) {
          newPrompt = promptCache.standard;
        }
      }
      
      // If no cached prompt, generate a new one
      if (!newPrompt) {
        if (usePersonalized && journalEntries && journalEntries.length > 2) {
          newPrompt = await generatePersonalizedPrompt(user.id);
          
          // Cache the personalized prompt
          if (newPrompt) {
            promptCache.personalized.set(user.id, newPrompt);
            promptCache.timestamp = Date.now();
          }
        } else {
          newPrompt = await generateStandardJournalPrompt();
          
          // Cache the standard prompt
          if (newPrompt) {
            promptCache.standard = newPrompt;
            promptCache.timestamp = Date.now();
          }
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
      generationInProgress.current = false;
    }
  }, [user, usePersonalized, journalEntries, toast]);

  const togglePersonalizedPrompts = useCallback(() => {
    setUsePersonalized(prev => {
      const newValue = !prev;
      // Only generate new prompt when turning personalization on if we don't have a cached one
      if (newValue && user && (!isCacheValid() || !promptCache.personalized.has(user.id))) {
        generateNewPrompt();
      }
      return newValue;
    });
  }, [generateNewPrompt, user]);

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
