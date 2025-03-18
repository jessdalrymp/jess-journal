
import React from 'react';
import { Sparkles, Lightbulb, Heart } from 'lucide-react';

export const Benefits = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Benefits of JESS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard
            icon={<Lightbulb className="text-jess-primary" size={28} />}
            title="Deeper Self-Understanding"
            description="Gain insights into your thought patterns, emotional responses, and personal narratives through guided reflection."
          />
          
          <BenefitCard
            icon={<Sparkles className="text-jess-primary" size={28} />}
            title="Personalized Growth"
            description="Receive tailored guidance based on your unique journey, challenges, and goals with AI-powered journaling."
          />
          
          <BenefitCard
            icon={<Heart className="text-jess-primary" size={28} />}
            title="Emotional Clarity"
            description="Process complex feelings with journal prompts designed to help you explore and understand your emotional landscape."
          />
        </div>
      </div>
    </section>
  );
};

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitCardProps) => (
  <div className="card-base">
    {icon}
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-jess-muted">{description}</p>
  </div>
);
