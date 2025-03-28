
import { JournalPrompt } from './types';
import { generateDeepseekResponse, extractDeepseekResponseText, generatePersonalizedJournalPrompt } from "@/utils/deepseekApi";

// Cache for standard prompts to avoid regenerating similar ones
const promptCache = new Map<string, JournalPrompt>();
const CACHE_KEY = 'standard_prompt';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
let lastCacheTime = 0;

// Fallback prompts to use when API calls fail
const FALLBACK_PROMPTS: JournalPrompt[] = [
  {
    title: "Reflecting on Growth Moments",
    prompt: "Think about a recent challenge you faced. How did you respond, and what did you learn about yourself?",
    instructions: [
      "Take a few minutes to recall a specific challenging situation",
      "Write about your initial reaction and emotions",
      "Describe the actions you took to address the situation",
      "Reflect on what this experience taught you about yourself"
    ]
  },
  {
    title: "Future Self Dialogue",
    prompt: "What would your future self, 5 years from now, want to tell you about your current priorities and concerns?",
    instructions: [
      "Imagine yourself 5 years in the future looking back at today",
      "Write a letter from your future self to your present self",
      "Address your current worries, goals, and daily habits",
      "Include advice and perspective that only time could provide"
    ]
  },
  {
    title: "Values Exploration",
    prompt: "What three values are most important to you right now, and how are they showing up in your daily life?",
    instructions: [
      "Identify three core values that feel most important to you currently",
      "For each value, write specific examples of how it influences your decisions",
      "Note any areas where you'd like to align more closely with these values",
      "Consider one small step you could take today to honor each value"
    ]
  }
];

export async function generateStandardJournalPrompt(): Promise<JournalPrompt | null> {
  // When explicitly generating a new prompt, we'll bypass the cache
  // or use a random cache entry to ensure variety
  
  // Set a request timeout
  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), 10000); // 10-second timeout
  });

  try {
    const systemPrompt = `You are JESS, an AI life coach specializing in creating personalized writing prompts and journaling exercises.
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

    // Race between API call and timeout
    const responsePromise = generateDeepseekResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate a completely new journaling challenge for me that will help me reflect on my growth and patterns. Make it different from any previous challenges.' }
    ]);
    
    const response = await Promise.race([responsePromise, timeoutPromise]);
    
    // If timeout won or response is null, use fallback prompt
    if (!response) {
      console.log('API request timed out, using fallback prompt');
      const fallbackPrompt = FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
      return fallbackPrompt;
    }
    
    const rawText = extractDeepseekResponseText(response);
    
    // Extract JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const prompt = JSON.parse(jsonMatch[0]);
        return prompt;
      } catch (e) {
        console.error("Error parsing journal prompt JSON:", e);
        // Use fallback prompt if parsing fails
        const fallbackPrompt = FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
        return fallbackPrompt;
      }
    } else {
      throw new Error("Could not parse journal prompt JSON");
    }
  } catch (error) {
    console.error("Error generating standard journal prompt:", error);
    // Use fallback prompt if API call fails
    const fallbackPrompt = FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
    return fallbackPrompt;
  }
}

// Cache for personalized prompts (user-specific)
const personalizedCache = new Map<string, {prompt: JournalPrompt, timestamp: number}>();
const PERSONALIZED_CACHE_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours

export async function generatePersonalizedPrompt(userId: string): Promise<JournalPrompt | null> {
  // We'll always generate a new personalized prompt when requested
  
  // Set a request timeout
  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), 10000); // 10-second timeout
  });
  
  try {
    const personalizedPromptPromise = generatePersonalizedJournalPrompt(userId);
    const personalizedPromptText = await Promise.race([personalizedPromptPromise, timeoutPromise]);
    
    // If timeout won or response is null, use fallback prompt
    if (!personalizedPromptText) {
      console.log('Personalized API request timed out, using fallback prompt');
      const fallbackPrompt = FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
      return fallbackPrompt;
    }
    
    // Format the personalized prompt in the standard format
    const systemPrompt = `You are JESS, an AI life coach specializing in creating personalized writing prompts.
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

    const formattingPromise = generateDeepseekResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Format this personalized prompt into a structured journal challenge that is fresh and unique' }
    ]);
    
    const formattingResponse = await Promise.race([formattingPromise, timeoutPromise]);
    
    // If timeout won or response is null, use fallback prompt with personalized text
    if (!formattingResponse) {
      console.log('Formatting API request timed out, using semi-personalized fallback');
      const fallbackPrompt = {
        ...FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)],
        prompt: personalizedPromptText as string
      };
      return fallbackPrompt;
    }
    
    const rawText = extractDeepseekResponseText(formattingResponse);
    
    // Extract JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const prompt = JSON.parse(jsonMatch[0]);
        return prompt;
      } catch (error) {
        console.error("Error parsing personalized journal prompt JSON:", error);
        // Use fallback with the personalized prompt text
        const fallbackPrompt = {
          ...FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)],
          prompt: personalizedPromptText as string
        };
        return fallbackPrompt;
      }
    } else {
      throw new Error("Could not parse personalized journal prompt JSON");
    }
  } catch (error) {
    console.error("Error generating personalized journal prompt:", error);
    // Use fallback prompt if API call fails
    const fallbackPrompt = FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
    return fallbackPrompt;
  }
}
