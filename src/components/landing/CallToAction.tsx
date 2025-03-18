
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';

export const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-jess-subtle to-jess-subtle/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-jess-primary/10 text-jess-primary px-4 py-2 rounded-full mb-6">
          <Zap size={16} className="animate-pulse" />
          <span className="text-sm font-medium">Limited Time Free Trial!</span>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Ready for a Journaling Experience That's Truly Yours?</h2>
        <p className="text-xl text-jess-muted max-w-2xl mx-auto mb-8">
          Join the thousands already rewriting their stories through deeply personal, AI-driven journaling.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <Link to="/dashboard">
            <Button size="lg" className="px-8 w-full sm:w-auto text-lg bg-gradient-to-r from-jess-primary to-jess-primary/80 hover:from-jess-primary/90 hover:to-jess-primary group transition-all duration-300">
              Start Your Free Personalized Journey Now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </Link>
          <Link to="/free-journal-prompts">
            <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto">
              Try Free Prompts
            </Button>
          </Link>
        </div>
        
        <div className="max-w-2xl mx-auto p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-jess-primary/10 text-sm text-jess-muted">
          <p>No credit card required to start. Cancel anytime. Your privacy is our priority.</p>
        </div>
      </div>
    </section>
  );
};
