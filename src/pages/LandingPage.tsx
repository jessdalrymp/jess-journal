
import React from 'react';
import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { GettingStarted } from '../components/landing/GettingStarted';
import { Benefits } from '../components/landing/Benefits';
import { CallToAction } from '../components/landing/CallToAction';
import { Pricing } from '../components/landing/Pricing';
import { Footer } from '../components/landing/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-jess-subtle/30">
      <Header />
      <main className="text-jess-foreground">
        <Hero />
        <HowItWorks />
        
        {/* Free Prompts Highlight Section */}
        <section className="py-12 bg-jess-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Free Journal Prompts</h2>
            <p className="text-xl text-jess-muted max-w-2xl mx-auto mb-8">
              Need inspiration? Browse our collection of free journaling prompts organized by categories.
            </p>
            <Link to="/free-journal-prompts">
              <Button size="lg" variant="secondary" className="px-8">
                Explore Prompts
              </Button>
            </Link>
          </div>
        </section>
        
        <GettingStarted />
        <Benefits />
        <CallToAction />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
