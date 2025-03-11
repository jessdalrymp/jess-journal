
export type JournalPrompt = {
  title: string;
  prompt: string;
  instructions: string[];
};

export const DEFAULT_PROMPT: JournalPrompt = {
  title: "Reflecting on Your Growth Journey",
  prompt: "What patterns have you noticed in how you respond to challenges? How has your perspective shifted over time?",
  instructions: [
    "Take 10 minutes to freely write about your thoughts and feelings on this topic",
    "Focus on specific examples from your past that illustrate your growth",
    "Consider how your current perspective differs from your past self",
    "Reflect on what these changes reveal about your personal development"
  ]
};
