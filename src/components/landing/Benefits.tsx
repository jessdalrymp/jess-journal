
import React from 'react';
import { Sparkles, Lightbulb, Heart, Eye, Brain, Fingerprint } from 'lucide-react';

export const Benefits = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">
          Transformational Benefits You'll Experience
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard
            icon={<Eye className="text-jess-primary" size={28} />}
            title="True Self-Insight"
            description="Uncover hidden patterns and emotions genuinely rooted in your personal experiences."
            emoji="🧘"
          />
          
          <BenefitCard
            icon={<Fingerprint className="text-jess-primary" size={28} />}
            title="Genuine Personalization"
            description="Experience a journaling process authentically adapted to your evolving story."
            emoji="🌟"
          />
          
          <BenefitCard
            icon={<Brain className="text-jess-primary" size={28} />}
            title="Empowered Emotional Growth"
            description="Gain clarity and confidence in navigating your emotional landscape without external biases."
            emoji="💡"
          />
        </div>
        
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Stories from JESS Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard
              quote="JESS doesn't just listen—it understands me. I've never felt more clearly seen."
              author="Ava M."
              role="Writer & Journal Enthusiast"
              stars={5}
            />
            <TestimonialCard
              quote="Finally, insights built entirely from my own words. JESS is a game-changer."
              author="Jake T."
              role="Self-Development Coach"
              stars={5}
            />
            <TestimonialCard
              quote="It's like having a conversation with myself, only deeper and free of judgment."
              author="Maya S."
              role="Daily Journaler, 2+ Years"
              stars={5}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  emoji: string;
}

const BenefitCard = ({ icon, title, description, emoji }: BenefitCardProps) => (
  <div className="card-base hover-lift">
    <div className="flex items-center mb-4">
      {icon}
      <span className="text-2xl ml-2">{emoji}</span>
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-jess-muted">{description}</p>
  </div>
);

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  stars?: number;
}

const TestimonialCard = ({ quote, author, role, stars = 5 }: TestimonialCardProps) => (
  <div className="card-base hover-lift">
    <div className="text-jess-primary text-xl mb-2">
      {"⭐".repeat(stars)}
    </div>
    <p className="italic mb-4">"{quote}"</p>
    <p className="font-bold">– {author}</p>
    {role && <p className="text-sm text-jess-muted">{role}</p>}
  </div>
);
