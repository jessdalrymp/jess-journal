
import React, { useState, useEffect } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';
import { generateDeepseekResponse, extractDeepseekResponseText } from '../../utils/deepseekApi';

export const GrowthInsights = () => {
  const { user, profile, loading } = useUserData();
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user && profile) {
      generateInsight();
    }
  }, [loading, user, profile]);

  const generateInsight = async () => {
    if (!user || !profile) return;
    
    try {
      setIsLoading(true);
      
      // Extract relevant user data for the prompt
      const growthStage = profile.growthStage || 'exploring';
      const challenges = profile.challenges?.join(', ') || 'personal growth';
      const learningStyle = profile.learningStyle || 'reflective';
      
      // Create prompt for the AI
      const systemPrompt = `You are Jess, an insightful AI journal coach. You craft brief, personalized observations about growth and potential.
      Keep your message encouraging, concise (max 2 sentences), and specific to the user's current growth journey.
      Focus on ONE aspect of their profile that seems most relevant. Be warm and supportive.`;
      
      const userPrompt = `Based on my profile (Growth stage: ${growthStage}, Challenges: ${challenges}, Learning style: ${learningStyle}), 
      share a brief insight about my growth journey or potential.`;
      
      // Generate response
      const response = await generateDeepseekResponse([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);
      
      const insightText = extractDeepseekResponseText(response);
      setInsight(insightText);
    } catch (error) {
      console.error("Error generating insight:", error);
      setInsight("I notice your commitment to growth through journaling. What patterns are you curious to explore today?");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !insight) {
    return null;
  }

  return (
    <Alert className="mb-6 border-jess-primary/20 bg-jess-primary/5">
      <Sparkles className="h-4 w-4 text-jess-primary" />
      <AlertTitle className="text-jess-primary font-medium">Growth Insight</AlertTitle>
      <AlertDescription className="mt-1 text-jess-foreground">
        {insight}
      </AlertDescription>
    </Alert>
  );
};
