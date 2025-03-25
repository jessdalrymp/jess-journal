
import React, { useState, useEffect } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { Sparkles } from 'lucide-react';
import { generateDeepseekResponse, extractDeepseekResponseText } from '../../utils/deepseekApi';
import { convertToSecondPerson } from '../../utils/contentParser';

export const GrowthInsights = () => {
  const { user, profile, loading, journalEntries } = useUserData();
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user && profile && journalEntries) {
      generateInsight();
    }
  }, [loading, user, profile, journalEntries]);

  const generateInsight = async () => {
    if (!user || !profile) return;
    
    try {
      setIsLoading(true);
      
      // Extract relevant user data for the prompt
      const userName = user.name || 'there';
      const growthStage = profile.growthStage || 'exploring';
      const challenges = profile.challenges?.join(', ') || 'personal growth';
      const learningStyle = profile.learningStyle || 'reflective';
      
      // Get recent journal entries for analysis
      const recentEntries = journalEntries?.slice(0, 5).map(entry => ({
        date: new Date(entry.createdAt).toLocaleDateString(),
        title: entry.title,
        content: entry.content.substring(0, 300) + (entry.content.length > 300 ? '...' : ''),
        type: entry.type
      })) || [];
      
      // Create journal entries text for the prompt
      const entriesText = recentEntries.length > 0 
        ? `Recent journal entries:\n${recentEntries.map(entry => 
            `Date: ${entry.date}\nTitle: ${entry.title}\nExcerpt: ${entry.content}\n`
          ).join('\n')}`
        : 'No recent journal entries.';
      
      // Create prompt for the AI - explicitly requesting second-person language
      const systemPrompt = `You are Jess, an insightful AI journal coach. You craft brief, personalized observations about growth and potential.
      Analyze the user's journal entries to identify themes, progress, or areas of focus.
      Keep your message encouraging, concise (max 2 sentences), and specific to the user's current growth journey.
      Always address the user by name at the beginning of your message.
      Be warm, supportive, and focus on their recent journal content.
      ALWAYS use second-person language (you/your) rather than third-person (they/their/the user).`;
      
      const userPrompt = `Here's my profile and journal information:
      
      Name: ${userName}
      Growth stage: ${growthStage}
      Challenges: ${challenges}
      Learning style: ${learningStyle}
      
      ${entriesText}
      
      Based on my journal entries and profile, share a personalized insight about my growth journey. Address me directly using "you/your" language.`;
      
      // Generate response
      const response = await generateDeepseekResponse([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);
      
      const insightText = extractDeepseekResponseText(response);
      // Apply second-person conversion to ensure consistent style
      const formattedInsight = convertToSecondPerson(insightText);
      setInsight(formattedInsight);
    } catch (error) {
      console.error("Error generating insight:", error);
      const userName = user.name || 'there';
      setInsight(`Welcome back, ${userName}! I notice your commitment to growth through journaling. What patterns are you curious to explore today?`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !insight) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-medium mb-4 bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-jess-primary" />
        Growth Insight
      </h2>
      <p className="text-jess-foreground text-lg">
        {insight}
      </p>
    </div>
  );
};
