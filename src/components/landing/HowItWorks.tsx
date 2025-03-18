
import React from 'react';
import { Book, Compass, MessageSquare, User } from 'lucide-react';

export const HowItWorks = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">How JESS Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Book className="text-jess-primary" size={28} />}
            title="Journaling"
            description="Express your thoughts freely with guided prompts or open journal sessions that help you process your experiences."
          />
          
          <FeatureCard
            icon={<Compass className="text-jess-primary" size={28} />}
            title="Exploration"
            description="Dive deeper into your patterns and behaviors through targeted side quests and challenges that spark reflection."
          />
          
          <FeatureCard
            icon={<MessageSquare className="text-jess-primary" size={28} />}
            title="Storytelling"
            description="Reshape your personal narrative with AI-guided reflections that help you see your experiences from new perspectives."
          />
          
          <FeatureCard
            icon={<User className="text-jess-primary" size={28} />}
            title="Self-Discovery"
            description="Gain clarity on your values, strengths, and growth areas through personalized insights and tailored prompts."
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="card-base flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-jess-subtle rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-jess-muted">{description}</p>
  </div>
);
