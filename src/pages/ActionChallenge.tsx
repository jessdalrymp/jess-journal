
import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { useNavigate } from "react-router-dom";
import { WelcomeModal } from "../components/chat/WelcomeModal";
import { ChallengeSuccessDialog } from "../components/challenges/ChallengeSuccessDialog";
import { JournalingDialog } from "../components/challenges/JournalingDialog";
import { ChallengeDisplay } from "../components/challenges/ChallengeDisplay";
import { generateDeepseekResponse, extractDeepseekResponseText } from "../utils/deepseekApi";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type Challenge = {
  title: string;
  steps: string[];
};

const DEFAULT_CHALLENGE: Challenge = {
  title: "Express Yourself: The 5-Day Scream Challenge",
  steps: [
    "Find a private outdoor location where you feel comfortable and yell out your feelings for 30 seconds each day. Use this time to vocalize anything that has been on your mind, including frustrations, joys, or fears.",
    "After each scream session, write down the thoughts and feelings that emerged during the yelling. Reflect on what came up and how it made you feel afterward.",
    "Invite a close friend or family member to join you for a group scream session on the last day. Share what you've learned about yourself during the week and discuss any barriers to communicating openly.",
    "Create a short video documenting your experience over the week, including snippets of your scream sessions (without showing others) and your reflections, then share it privately with someone you trust to reinforce accountability."
  ]
};

const ActionChallenge = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showJournaling, setShowJournaling] = useState(false);
  const [challenge, setChallenge] = useState<Challenge>(DEFAULT_CHALLENGE);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Show welcome modal only first time user visits this page
    const hasVisitedActionChallenge = localStorage.getItem("hasVisitedActionChallengePage");
    if (!hasVisitedActionChallenge) {
      setShowWelcome(true);
      localStorage.setItem("hasVisitedActionChallengePage", "true");
    }
  }, []); 

  const handleBack = () => {
    navigate('/');
  };

  const handleAcceptChallenge = () => {
    setShowSuccess(true);
  };

  const handleStartJournaling = () => {
    setShowSuccess(false);
    setShowJournaling(true);
  };

  const handleGenerateNewChallenge = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate a new challenge",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const systemPrompt = `You are Jess, an AI life coach specializing in creating personalized growth challenges. 
      Create a unique, experiential challenge that will help users break out of their comfort zone and experience new insights.
      
      Your response must follow this exact format:
      
      {
        "title": "Short, engaging title for the challenge",
        "steps": [
          "Step 1 description with clear actionable instructions",
          "Step 2 description with clear actionable instructions",
          "Step 3 description with clear actionable instructions",
          "Step 4 description with clear actionable instructions"
        ]
      }
      
      The challenge should:
      - Push the user beyond their normal thought patterns
      - Include some social or environmental component
      - Involve real-world actions, not just reflection
      - Be specific and clear to follow
      - Be slightly uncomfortable but safe
      - Create opportunities for emotional shifts and insights
      
      ONLY return valid JSON. No other text.`;

      const response = await generateDeepseekResponse([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate a new action challenge for me' }
      ]);

      const rawText = extractDeepseekResponseText(response);
      
      try {
        // Extract JSON from the response (in case there's any extra text)
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const newChallenge = JSON.parse(jsonMatch[0]);
          setChallenge(newChallenge);
        } else {
          throw new Error("Could not parse challenge JSON");
        }
      } catch (jsonError) {
        console.error("Failed to parse challenge:", jsonError);
        toast({
          title: "Error generating challenge",
          description: "Could not create a new challenge. Using default challenge instead.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating challenge:", error);
      toast({
        title: "Error generating challenge",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 px-4 sm:px-6 py-4 container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-200px)]">
          <ChallengeDisplay 
            challenge={challenge}
            onBack={handleBack}
            onAcceptChallenge={handleAcceptChallenge}
            onNewChallenge={handleGenerateNewChallenge}
            isLoading={isLoading}
          />
        </div>
      </main>
      <DisclaimerBanner />
      
      <WelcomeModal
        open={showWelcome}
        onOpenChange={setShowWelcome}
        title="Welcome to Action Challenge"
        description="Here you'll receive a personalized challenge designed to create real shifts in your thinking and behavior. These challenges are experiential and designed to help you break out of your habitual patterns."
        buttonText="Let's Begin"
      />

      <ChallengeSuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        onStartJournaling={handleStartJournaling}
      />

      <JournalingDialog
        open={showJournaling}
        onOpenChange={setShowJournaling}
        challengeType="action"
      />
    </div>
  );
};

export default ActionChallenge;
