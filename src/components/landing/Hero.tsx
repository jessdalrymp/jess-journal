
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const Hero = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="container mx-auto px-4 py-8 md:py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 bg-jess-primary/10 text-jess-primary px-4 py-2 rounded-full mb-4 md:mb-6">
          <Sparkles size={16} />
          <span className="text-sm font-medium">AI-Powered Self-Discovery</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">
          {isMobile ? (
            <>Rewrite Your Life Story<br />with Journaling That<br />Truly Understands You</>
          ) : (
            <>Rewrite Your Life Story with<br />Journaling That Truly Understands You</>
          )}
        </h1>
        <p className="text-xl text-jess-muted max-w-3xl mx-auto mb-6 md:mb-8">
          JESS transforms your thoughts into powerful self-discovery. Using your own words, 
          our AI builds a uniquely personalized journaling journey, free from biases or external agendas.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center mb-6 md:mb-10">
          <div className="text-2xl font-bold text-jess-primary">
            ⭐⭐⭐⭐⭐ {isMobile && <br />}Empowering Personal Growth for Thousands
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-6 md:mb-10">
          <div className="card-base hover-lift">
            <p className="text-lg">✅ Feel deeply understood on your terms</p>
          </div>
          <div className="card-base hover-lift">
            <p className="text-lg">✅ Receive truly personal insights, crafted just for you</p>
          </div>
          <div className="card-base hover-lift">
            <p className="text-lg">✅ Enjoy journaling free from unwanted judgments</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/dashboard">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-gradient-to-r from-jess-primary to-jess-primary/80 hover:from-jess-primary/90 hover:to-jess-primary animate-pulse-soft">
              Begin Your Personal Journey
              <ChevronRight className="ml-2" size={18} />
            </Button>
          </Link>
          <Link to="/free-journal-prompts">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <BookOpen className="mr-2" size={18} />
              Browse Free Prompts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
