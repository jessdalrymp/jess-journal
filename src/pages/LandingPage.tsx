
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Book, Compass, MessageSquare, User, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthFormHeader } from '../components/auth/AuthFormHeader';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-jess-subtle/30">
      {/* Header */}
      <header className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <AuthFormHeader />
          <div className="hidden md:flex space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Main Hero */}
        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Personal AI Storytelling Coach
            </h1>
            <p className="text-xl text-jess-muted max-w-3xl mx-auto mb-8">
              JESS guides you through Journaling, Exploration, Storytelling, and Self-Discovery 
              to help you understand your narrative and grow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Journey
                  <ChevronRight className="ml-2" size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Login to Continue
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How JESS Works */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How JESS Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card-base flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-jess-subtle rounded-full flex items-center justify-center mb-4">
                  <Book className="text-jess-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Journaling</h3>
                <p className="text-jess-muted">
                  Express your thoughts freely in guided or open journal sessions that help you 
                  process your experiences.
                </p>
              </div>
              
              <div className="card-base flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-jess-subtle rounded-full flex items-center justify-center mb-4">
                  <Compass className="text-jess-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Exploration</h3>
                <p className="text-jess-muted">
                  Dive deeper into your patterns, beliefs, and behaviors through targeted 
                  side quests and challenges.
                </p>
              </div>
              
              <div className="card-base flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-jess-subtle rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="text-jess-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Storytelling</h3>
                <p className="text-jess-muted">
                  Reshape your personal narrative with AI-guided reflections that help you see 
                  yourself in a new light.
                </p>
              </div>
              
              <div className="card-base flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-jess-subtle rounded-full flex items-center justify-center mb-4">
                  <User className="text-jess-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Self-Discovery</h3>
                <p className="text-jess-muted">
                  Gain clarity on your values, strengths, and growth areas through personalized 
                  insights.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Getting Started Guide */}
        <section className="py-16 bg-jess-subtle/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Getting Started with JESS</h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-jess-primary text-white flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Create Your Account</h3>
                    <p className="text-jess-muted mb-2">
                      Sign up and complete a brief onboarding questionnaire to help JESS understand your needs.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-jess-primary text-white flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Explore Core Features</h3>
                    <p className="text-jess-muted mb-2">
                      Navigate to My Story, Side Quest, Journal Entry, or Journal Challenge depending on your goals.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-jess-primary text-white flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Journal Consistently</h3>
                    <p className="text-jess-muted mb-2">
                      Build a practice of regular reflection through guided and free-form writing sessions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-jess-primary text-white flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Review Your Progress</h3>
                    <p className="text-jess-muted mb-2">
                      Visit Journal History to see your growth over time and identify recurring themes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Benefits of JESS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-base">
                <Sparkles className="text-jess-primary mb-4" size={28} />
                <h3 className="text-xl font-bold mb-2">Deeper Self-Understanding</h3>
                <p className="text-jess-muted">
                  Gain insights into your thought patterns, emotional responses, and personal narratives.
                </p>
              </div>
              
              <div className="card-base">
                <Sparkles className="text-jess-primary mb-4" size={28} />
                <h3 className="text-xl font-bold mb-2">Personalized Growth</h3>
                <p className="text-jess-muted">
                  Receive tailored guidance based on your unique journey, challenges, and goals.
                </p>
              </div>
              
              <div className="card-base">
                <Sparkles className="text-jess-primary mb-4" size={28} />
                <h3 className="text-xl font-bold mb-2">Emotional Clarity</h3>
                <p className="text-jess-muted">
                  Process complex feelings and situations with an AI companion that helps you see things clearly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-jess-subtle to-jess-subtle/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Self-Discovery Journey Today</h2>
            <p className="text-xl text-jess-muted max-w-2xl mx-auto mb-8">
              Join thousands who are using JESS to better understand themselves and shape their futures.
            </p>
            <Link to="/signup">
              <Button size="lg" className="px-8">
                Begin Your Story
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Pricing Section - Moved to bottom */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Simple, Transparent Pricing</h2>
            <div className="max-w-lg mx-auto bg-white border border-jess-subtle rounded-xl p-8 shadow-sm">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Monthly Plan</h3>
                <div className="flex items-baseline justify-center gap-x-2 mb-6">
                  <span className="text-4xl font-bold">$14.99</span>
                  <span className="text-jess-muted">/month</span>
                </div>
                <p className="text-jess-muted mb-6">Start with a 7-day free trial</p>
                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited conversations with JESS</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Guided journaling experiences</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Personalized story exploration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Advanced self-discovery tools</span>
                  </li>
                </ul>
                <Link to="/signup">
                  <Button size="lg" className="w-full">
                    Start 7-Day Free Trial
                  </Button>
                </Link>
                <p className="text-sm text-jess-muted mt-4">No credit card required for trial</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-jess-primary">JESS</h2>
              <p className="text-jess-muted">Your AI Storytelling Coach</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link to="/legal" className="text-jess-muted hover:text-jess-primary">
                Terms & Privacy
              </Link>
              <Link to="/about" className="text-jess-muted hover:text-jess-primary">
                About
              </Link>
              <Link to="/contact" className="text-jess-muted hover:text-jess-primary">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-jess-muted">
            &copy; {new Date().getFullYear()} JESS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

