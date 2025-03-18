
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Rewrite Your Life Story with Journaling That Truly Understands You
        </h1>
        <p className="text-xl text-jess-muted max-w-3xl mx-auto mb-8">
          JESS transforms your thoughts into powerful self-discovery. Using your own words, 
          our AI builds a uniquely personalized journaling journey, free from biases or external agendas.
        </p>
        
        <div className="flex justify-center mb-10">
          <div className="text-2xl font-bold text-jess-primary">
            ⭐⭐⭐⭐⭐ Empowering Personal Growth for Thousands
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
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
            <Button size="lg" className="w-full sm:w-auto text-lg px-8">
              Begin Your Personal Journey
              <ChevronRight className="ml-2" size={18} />
            </Button>
          </Link>
          <Link to="/free-journal-prompts">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Browse Free Prompts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
