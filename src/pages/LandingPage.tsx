
import React from 'react';
import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { GettingStarted } from '../components/landing/GettingStarted';
import { Benefits } from '../components/landing/Benefits';
import { CallToAction } from '../components/landing/CallToAction';
import { Pricing } from '../components/landing/Pricing';
import { Footer } from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-jess-subtle/30">
      <Header />
      <main className="text-jess-foreground">
        <Hero />
        <HowItWorks />
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
