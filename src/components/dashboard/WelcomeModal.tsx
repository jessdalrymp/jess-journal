
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, BookOpen, MessageSquare, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardWelcomeModal = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenDashboardWelcome');
    if (!hasSeenWelcome) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenDashboardWelcome', 'true');
    setOpen(false);
  };

  const onboardingSteps = [
    {
      title: "Welcome to JESS",
      description: "Your personal AI journaling coach is here to help you explore your thoughts and feelings.",
      content: (
        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-r from-jess-primary/10 to-jess-subtle/30 p-5 rounded-lg border border-jess-subtle">
            <h3 className="text-lg font-medium mb-2 text-jess-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-jess-primary" /> Getting Started
            </h3>
            <p className="text-sm text-jess-muted">
              JESS helps you journal with purpose. We'll guide you through features designed to 
              help you reflect, grow, and discover insights about yourself.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Core Features",
      description: "Explore the key features that make JESS your perfect journaling companion.",
      content: (
        <div className="grid gap-4 py-4">
          <div className="bg-gradient-to-r from-jess-subtle/50 to-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-jess-subtle/50">
            <div className="flex items-center gap-3">
              <div className="bg-jess-primary/10 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-jess-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1 text-jess-foreground">My Story</h3>
                <p className="text-xs text-jess-muted">Explore your personal narrative through guided storytelling</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-jess-subtle/50 to-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-jess-subtle/50">
            <div className="flex items-center gap-3">
              <div className="bg-jess-primary/10 p-2 rounded-full">
                <MessageSquare className="h-5 w-5 text-jess-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1 text-jess-foreground">Side Quest</h3>
                <p className="text-xs text-jess-muted">Embark on creative journaling adventures for new perspectives</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-jess-subtle/50 to-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-jess-subtle/50">
            <div className="flex items-center gap-3">
              <div className="bg-jess-primary/10 p-2 rounded-full">
                <PenLine className="h-5 w-5 text-jess-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1 text-jess-foreground">Journal Challenge</h3>
                <p className="text-xs text-jess-muted">Respond to personalized prompts designed to help you reflect and grow</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Your Journey Starts Now",
      description: "Ready to begin? Let's create your first journal entry together.",
      content: (
        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-br from-jess-primary/10 to-jess-secondary/20 p-5 rounded-lg border border-jess-subtle/50 text-center">
            <h3 className="text-lg font-medium mb-3 text-jess-foreground">What would you like to try first?</h3>
            <div className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-3">
              <Button
                variant="outline"
                className="bg-white/70 hover:bg-white border border-jess-subtle/50 flex flex-col py-6 h-auto gap-2 shadow-sm hover:shadow-md transition-all"
                asChild
              >
                <Link to="/my-story">
                  <BookOpen className="h-6 w-6 text-jess-primary" />
                  <span>My Story</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="bg-white/70 hover:bg-white border border-jess-subtle/50 flex flex-col py-6 h-auto gap-2 shadow-sm hover:shadow-md transition-all"
                asChild
              >
                <Link to="/side-quest">
                  <MessageSquare className="h-6 w-6 text-jess-primary" />
                  <span>Side Quest</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="bg-white/70 hover:bg-white border border-jess-subtle/50 flex flex-col py-6 h-auto gap-2 shadow-sm hover:shadow-md transition-all"
                asChild
              >
                <Link to="/journal-challenge">
                  <PenLine className="h-6 w-6 text-jess-primary" />
                  <span>Journal</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentOnboardingStep = onboardingSteps[currentStep];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg mx-4 bg-white/95 backdrop-blur-sm border border-jess-subtle/50 shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">
            {currentOnboardingStep.title} {currentStep === 0 && <Sparkles className="h-5 w-5 text-jess-primary" />}
          </DialogTitle>
          <DialogDescription className="text-jess-muted">
            {currentOnboardingStep.description}
          </DialogDescription>
        </DialogHeader>
        
        {currentOnboardingStep.content}
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            {Array.from({ length: onboardingSteps.length }).map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-jess-primary' 
                    : index < currentStep 
                    ? 'bg-jess-secondary' 
                    : 'bg-jess-subtle'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep} className="border-jess-subtle">
                Back
              </Button>
            )}
            <Button onClick={nextStep} className="bg-jess-primary hover:bg-jess-primary/90 text-white">
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
