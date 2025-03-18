
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-jess-subtle/30">
      <Header />
      <main className="text-jess-foreground">
        <Hero />
        <HowItWorks />
        <GettingStarted />
        <Benefits />
        
        {/* Feature Comparison Section */}
        <section className="py-16 bg-jess-subtle/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">Unique Features Crafted for You</h2>
            
            <div className="max-w-3xl mx-auto overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-jess-subtle">
                    <th className="border px-4 py-3 text-left">Features</th>
                    <th className="border px-4 py-3 text-center">JESS</th>
                    <th className="border px-4 py-3 text-center">Traditional Journaling Apps</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-3">True AI Personalization</td>
                    <td className="border px-4 py-3 text-center text-jess-primary font-bold">✅</td>
                    <td className="border px-4 py-3 text-center">❌</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-3">Judgment-Free Environment</td>
                    <td className="border px-4 py-3 text-center text-jess-primary font-bold">✅</td>
                    <td className="border px-4 py-3 text-center">❌</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-3">Unique-to-You Challenges</td>
                    <td className="border px-4 py-3 text-center text-jess-primary font-bold">✅</td>
                    <td className="border px-4 py-3 text-center">❌</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-3">Authentic Emotional Insights</td>
                    <td className="border px-4 py-3 text-center text-jess-primary font-bold">✅</td>
                    <td className="border px-4 py-3 text-center">❌</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-3">Adaptive Growth Journey</td>
                    <td className="border px-4 py-3 text-center text-jess-primary font-bold">✅</td>
                    <td className="border px-4 py-3 text-center">❌</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* FAQs Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">FAQs About JESS</h2>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <FaqItem 
                  question="Is JESS designed to replace therapy?" 
                  answer="No—JESS complements therapy by facilitating genuine self-discovery through personalized journaling." 
                />
                <FaqItem 
                  question="Will my privacy be protected?" 
                  answer="Absolutely. Your thoughts remain secure, confidential, and solely yours." 
                />
                <FaqItem 
                  question="Do I need previous journaling experience?" 
                  answer="Not at all. JESS meets you wherever you are in your journey." 
                />
                <FaqItem 
                  question="What happens after the free trial?" 
                  answer="You can continue with monthly or annual plans—transparent pricing, no surprises." 
                />
                <FaqItem 
                  question="Can JESS truly adapt to my unique experiences?" 
                  answer="Yes. JESS continuously evolves, learning deeply from your journal entries." 
                />
                <FaqItem 
                  question="What if JESS doesn't meet my expectations?" 
                  answer="We proudly stand by our satisfaction guarantee. Your experience matters." 
                />
              </Accordion>
            </div>
          </div>
        </section>
        
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
        
        <CallToAction />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => (
  <AccordionItem value={question}>
    <AccordionTrigger className="text-lg font-medium text-left">{question}</AccordionTrigger>
    <AccordionContent className="text-jess-muted">{answer}</AccordionContent>
  </AccordionItem>
);

export default Landing;
