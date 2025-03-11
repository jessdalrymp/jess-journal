
import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { ChatInterface } from "../components/chat/ChatInterface";
import { useNavigate, useLocation } from "react-router-dom";
import { WelcomeModal } from "../components/chat/WelcomeModal";
import { JournalingDialog } from "../components/challenges/JournalingDialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { generateDeepseekResponse, extractDeepseekResponseText } from "../utils/deepseekApi";
import { JournalChallengeDisplay } from "../components/journal/JournalChallengeDisplay";

type JournalPrompt = {
  title: string;
  prompt: string;
  instructions: string[];
};

const DEFAULT_PROMPT: JournalPrompt = {
  title: "Reflecting on Your Growth Journey",
  prompt: "What patterns have you noticed in how you respond to challenges? How has your perspective shifted over time?",
  instructions: [
    "Take 10 minutes to freely write about your thoughts and feelings on this topic",
    "Focus on specific examples from your past that illustrate your growth",
    "Consider how your current perspective differs from your past self",
    "Reflect on what these changes reveal about your personal development"
  ]
};

const JournalChallenge = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showJournaling, setShowJournaling] = useState(false);
  const [journalPrompt, setJournalPrompt] = useState<JournalPrompt>(DEFAULT_PROMPT);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isChatView = location.pathname === '/journal-challenge/chat';

  useEffect(() => {
    // Show welcome modal only first time user visits this page
    const hasVisitedJournalChallenge = localStorage.getItem("hasVisitedJournalChallengePage");
    if (!hasVisitedJournalChallenge) {
      setShowWelcome(true);
      localStorage.setItem("hasVisitedJournalChallengePage", "true");
    }
  }, []); 

  const handleBack = () => {
    if (isChatView) {
      navigate('/journal-challenge');
    } else {
      navigate('/');
    }
  };

  const handleAcceptChallenge = () => {
    setChallengeAccepted(true);
    setShowJournaling(true);
  };

  const handleGenerateNewChallenge = async () => {
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
          const newPrompt = JSON.parse(jsonMatch[0]);
          // Store the prompt in localStorage for chat context
          localStorage.setItem('currentJournalPrompt', JSON.stringify(newPrompt));
          setJournalPrompt(newPrompt);
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

  // Generate a journal prompt when the component mounts if the user is authenticated and no challenge is accepted
  useEffect(() => {
    if (user && !challengeAccepted) {
      // Check localStorage first
      const savedPrompt = localStorage.getItem('currentJournalPrompt');
      if (savedPrompt) {
        try {
          setJournalPrompt(JSON.parse(savedPrompt));
        } catch (e) {
          handleGenerateNewChallenge();
        }
      } else {
        handleGenerateNewChallenge();
      }
    }
  }, [user]);

  const handleChatView = () => {
    // Save current prompt to localStorage for chat context
    localStorage.setItem('currentJournalPrompt', JSON.stringify(journalPrompt));
    navigate('/journal-challenge/chat');
  };
  
  const handleRestartJournalChallenge = () => {
    navigate('/journal-challenge');
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 px-4 sm:px-6 py-3 container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-170px)]">
          {isChatView ? (
            <ChatInterface 
              type="journal" 
              onBack={handleBack}
              onRestart={handleRestartJournalChallenge}
            />
          ) : (
            <JournalChallengeDisplay
              journalPrompt={journalPrompt}
              onBack={handleBack}
              onAcceptChallenge={handleAcceptChallenge}
              onNewChallenge={handleGenerateNewChallenge}
              onStartChat={handleChatView}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>
      <DisclaimerBanner />
      
      <WelcomeModal
        open={showWelcome}
        onOpenChange={setShowWelcome}
        title="Welcome to Journal Challenge"
        description="Here you'll receive personalized writing prompts designed to help you reflect on your patterns, growth, and insights. These prompts will guide you to deeper self-awareness through regular journaling practice."
        buttonText="Let's Begin"
      />

      <JournalingDialog
        open={showJournaling}
        onOpenChange={setShowJournaling}
        challengeType="journal"
        promptText={journalPrompt.prompt}
      />
    </div>
  );
};

export default JournalChallenge;
