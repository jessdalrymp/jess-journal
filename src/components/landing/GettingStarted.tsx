
import React from 'react';
import { BookText } from 'lucide-react';

export const GettingStarted = () => {
  return (
    <section className="py-16 bg-jess-subtle/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Getting Started with JESS</h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <Step
              number={1}
              title="Create Your Account"
              description="Sign up and complete a brief onboarding questionnaire to help JESS understand your goals."
            />
            
            <Step
              number={2}
              title="Browse Free Journal Prompts"
              description="Explore our library of free journal prompts organized by categories to inspire your writing."
            />
            
            <Step
              number={3}
              title="Choose Your Journey"
              description="Navigate to My Story, Side Quest, Journal Entry, or Journal Challenge based on your needs."
            />
            
            <Step
              number={4}
              title="Journal Consistently"
              description="Build a practice of regular reflection through guided prompts and AI-assisted journaling."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-jess-primary text-white flex items-center justify-center flex-shrink-0">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-jess-muted mb-2">{description}</p>
    </div>
  </div>
);
