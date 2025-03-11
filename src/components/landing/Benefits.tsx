
import React from 'react';
import { Sparkles } from 'lucide-react';

export const Benefits = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Benefits of JESS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard
            title="Deeper Self-Understanding"
            description="Gain insights into your thought patterns, emotional responses, and personal narratives."
          />
          
          <BenefitCard
            title="Personalized Growth"
            description="Receive tailored guidance based on your unique journey, challenges, and goals."
          />
          
          <BenefitCard
            title="Emotional Clarity"
            description="Process complex feelings and situations with an AI companion that helps you see things clearly."
          />
        </div>
      </div>
    </section>
  );
};

interface BenefitCardProps {
  title: string;
  description: string;
}

const BenefitCard = ({ title, description }: BenefitCardProps) => (
  <div className="card-base">
    <Sparkles className="text-jess-primary mb-4" size={28} />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-jess-muted">{description}</p>
  </div>
);
