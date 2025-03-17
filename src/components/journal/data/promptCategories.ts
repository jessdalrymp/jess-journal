
import { Sun, Moon, Heart, Lightbulb, Leaf, Rocket, ListChecks } from 'lucide-react';
import { ReactNode } from 'react';

export interface PromptCategory {
  id: string;
  name: string;
  icon: {
    icon: typeof Sun | typeof Moon | typeof Heart | typeof Lightbulb | typeof Leaf | typeof Rocket | typeof ListChecks;
    color: string;
  };
  prompts: string[];
}

export type Prompt = string;

// Define prompt categories and their prompts
export const promptCategories: PromptCategory[] = [
  {
    id: 'morning',
    name: 'Morning Reflections',
    icon: {
      icon: Sun,
      color: 'text-amber-500'
    },
    prompts: [
      "What is my intention for today?",
      "What's one small step I can take today to honor my values?",
      "How do I want to feel by the end of today?",
      "What positive outcome do I want to visualize for today?",
      "What strength will I lean into today?"
    ]
  },
  {
    id: 'evening',
    name: 'Evening Reflections',
    icon: {
      icon: Moon,
      color: 'text-indigo-500'
    },
    prompts: [
      "What moment today made me feel most alive?",
      "What challenges did I encounter today, and how did I grow from them?",
      "What's one thing I learned about myself today?",
      "How did I align with my values today?",
      "What would I do differently if given another chance today?"
    ]
  },
  {
    id: 'gratitude',
    name: 'Daily Gratitude',
    icon: {
      icon: Heart, 
      color: 'text-rose-500'
    },
    prompts: [
      "List three specific things I'm grateful for right now.",
      "Who positively impacted my life today?",
      "What's one ordinary thing I often overlook but deeply appreciate?",
      "What's a recent experience I'm thankful to have had?",
      "How can I express my gratitude to someone today?"
    ]
  },
  {
    id: 'insights',
    name: 'Daily Insights & Growth',
    icon: {
      icon: Lightbulb,
      color: 'text-yellow-500'
    },
    prompts: [
      "What's a belief I've held recently that's limiting me?",
      "What's a recent realization or breakthrough I've experienced?",
      "What emotions am I currently experiencing, and what are they telling me?",
      "How am I resisting change, and what step can I take to embrace it?",
      "What's something uncomfortable I might need to face to grow?"
    ]
  },
  {
    id: 'selfcare',
    name: 'Self-Care & Mindfulness',
    icon: {
      icon: Leaf,
      color: 'text-green-500'
    },
    prompts: [
      "How will I nurture my mental and emotional well-being today?",
      "What boundaries do I need to reinforce today?",
      "What's one act of kindness I can show myself today?",
      "How will I practice mindfulness or grounding today?",
      "In what ways can I slow down and be present?"
    ]
  },
  {
    id: 'action',
    name: 'Action & Purpose',
    icon: {
      icon: Rocket,
      color: 'text-cyan-500'
    },
    prompts: [
      "What's a meaningful action step I can take towards my goals today?",
      "Who can I support or inspire today?",
      "How am I contributing positively to my community or the world around me?",
      "What's one decision today that aligns powerfully with my purpose?",
      "What small act of courage can I take today?"
    ]
  },
  {
    id: 'weekly',
    name: 'Weekly Themes',
    icon: {
      icon: ListChecks,
      color: 'text-violet-500'
    },
    prompts: [
      "Week of Courage: What's one courageous act I'll commit to today?",
      "Week of Simplicity: How can I simplify my day today?",
      "Week of Connection: Who can I meaningfully connect with today?",
      "Week of Growth: What habit am I developing this week?",
      "Week of Creativity: How will I express my creativity today?"
    ]
  }
];
