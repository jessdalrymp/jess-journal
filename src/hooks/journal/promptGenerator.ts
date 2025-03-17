
import { JournalPrompt } from './types';
import { generateDeepseekResponse, extractDeepseekResponseText, generatePersonalizedJournalPrompt } from "@/utils/deepseekApi";

// Cache for standard prompts to avoid regenerating similar ones
const promptCache = new Map<string, JournalPrompt>();
const CACHE_KEY = 'standard_prompt';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes
let lastCacheTime = 0;

export async function generateStandardJournalPrompt(): Promise<JournalPrompt | null> {
  // Check if we have a cached prompt that's not expired
  const now = Date.now();
  if (promptCache.has(CACHE_KEY) && (now - lastCacheTime) < CACHE_EXPIRY) {
    console.log('Using cached journal prompt');
    return promptCache.get(CACHE_KEY) || null;
  }

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

  try {
    const response = await generateDeepseekResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate a new journaling challenge for me that will help me reflect on my growth and patterns' }
    ]);

    const rawText = extractDeepseekResponseText(response);
    
    // Extract JSON from the response (in case there's any extra text)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const prompt = JSON.parse(jsonMatch[0]);
      // Cache the prompt
      promptCache.set(CACHE_KEY, prompt);
      lastCacheTime = now;
      return prompt;
    } else {
      throw new Error("Could not parse journal prompt JSON");
    }
  } catch (error) {
    console.error("Error parsing standard journal prompt:", error);
    return null;
  }
}

// Cache for personalized prompts (user-specific)
const personalizedCache = new Map<string, {prompt: JournalPrompt, timestamp: number}>();
const PERSONALIZED_CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

export async function generatePersonalizedPrompt(userId: string): Promise<JournalPrompt | null> {
  // Check if we have a cached personalized prompt that's not expired
  const now = Date.now();
  const cachedItem = personalizedCache.get(userId);
  
  if (cachedItem && (now - cachedItem.timestamp) < PERSONALIZED_CACHE_EXPIRY) {
    console.log('Using cached personalized journal prompt');
    return cachedItem.prompt;
  }
  
  try {
    const personalizedPromptText = await generatePersonalizedJournalPrompt(userId);
    
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
    
    // Extract JSON from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const prompt = JSON.parse(jsonMatch[0]);
      // Cache the personalized prompt
      personalizedCache.set(userId, {
        prompt,
        timestamp: now
      });
      return prompt;
    } else {
      throw new Error("Could not parse personalized journal prompt JSON");
    }
  } catch (error) {
    console.error("Error generating personalized journal prompt:", error);
    return null;
  }
}
