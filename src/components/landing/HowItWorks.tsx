
import React from 'react';
import { Book, Compass, MessageSquare, User } from 'lucide-react';

export const HowItWorks = () => {
  return (
    <section className="bg-jess-subtle/30 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-6">Experience a New Way of Journaling</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Book className="text-jess-primary" size={28} />}
            title="Guided by You"
            description="AI prompts directly inspired by your journaling entries."
          />
          
          <FeatureCard
            icon={<Compass className="text-jess-primary" size={28} />}
            title="Personal Side Quests"
            description="Targeted activities revealing insights unique to your journey."
          />
          
          <FeatureCard
            icon={<MessageSquare className="text-jess-primary" size={28} />}
            title="Narrative Transformation"
            description="AI reflections to help rewrite your personal story positively."
          />
          
          <FeatureCard
            icon={<User className="text-jess-primary" size={28} />}
            title="Authentic Self-Discovery"
            description="Custom-tailored insights offering clarity into your inner world."
          />
        </div>
        
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why JESS is the Solution You've Been Waiting For</h2>
          <div className="max-w-3xl mx-auto card-base p-8">
            <p className="text-lg mb-6">
              At JESS, we believe your personal growth journey deserves more than superficial prompts and recycled advice. 
              Our AI carefully listens, using your own words to provide custom-made insights that deeply resonate. 
              Each journaling prompt and reflection evolves from your narrative, creating an experience that's uniquely yours.
            </p>
            <p className="text-lg">
              Our dedicated team of AI experts and psychologists ensures JESS remains impartial, 
              compassionate, and continuously learning alongside you.
            </p>
          </div>
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
  <div className="card-base flex flex-col items-center text-center hover-lift">
    <div className="w-16 h-16 bg-jess-subtle rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-jess-muted">{description}</p>
  </div>
);
