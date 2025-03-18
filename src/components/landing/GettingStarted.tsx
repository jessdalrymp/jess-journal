
import React from 'react';
import { BookText, FileSparkles, PenLine, RefreshCw } from 'lucide-react';

export const GettingStarted = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">
          Your Path to Authentic Growth
        </h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <Step
              number={1}
              icon={<PenLine className="text-white" size={20} />}
              title="Start Journaling"
              description="Simply begin sharing your thoughts. JESS listens deeply to understand your unique perspective."
            />
            
            <Step
              number={2}
              icon={<FileSparkles className="text-white" size={20} />}
              title="Receive Personalized Reflections"
              description="JESS analyzes your words and offers insights that genuinely resonate with your experiences."
            />
            
            <Step
              number={3}
              icon={<RefreshCw className="text-white" size={20} />}
              title="Rewrite Your Story"
              description="Embrace lasting transformation guided by your true self, not someone else's expectations."
            />
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Do Any of These Experiences Sound Like You?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <ExperienceCard text="You pour your heart into journaling, but generic prompts feel meaningless." />
            <ExperienceCard text="You hesitate to share your true feelings, fearing judgment or misunderstanding." />
            <ExperienceCard text="You've been disappointed by biased advice, clouded by other people's agendas." />
            <ExperienceCard text="You're exhausted by attempts at self-discovery that leave you feeling unseen." />
          </div>
        </div>
      </div>
    </section>
  );
};

interface StepProps {
  number: number;
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const Step = ({ number, icon, title, description }: StepProps) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-jess-primary to-jess-primary/80 text-white flex items-center justify-center flex-shrink-0 shadow-md">
      {icon || number}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-jess-muted mb-2">{description}</p>
    </div>
  </div>
);

interface ExperienceCardProps {
  text: string;
}

const ExperienceCard = ({ text }: ExperienceCardProps) => (
  <div className="card-base hover-lift border-l-4 border-jess-primary/50">
    <p className="text-lg">{text}</p>
  </div>
);
