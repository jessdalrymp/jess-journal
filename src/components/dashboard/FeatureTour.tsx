
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export const FeatureTour = () => {
  const [activeTour, setActiveTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState({});
  
  const tourSteps: TourStep[] = [
    {
      target: '.core-actions-section',
      title: 'Core Actions',
      content: 'Access your main journaling activities here. Try clicking on one to get started!',
      placement: 'bottom',
    },
    {
      target: '.journal-history-section',
      title: 'Journal History',
      content: 'View all your past journal entries in one place.',
      placement: 'top',
    },
    {
      target: '.recent-activity-section',
      title: 'Recent Activity',
      content: 'Your latest journal entries will appear here for quick access.',
      placement: 'left',
    },
    {
      target: '.account-section',
      title: 'Account Settings',
      content: 'Manage your profile and subscription settings here.',
      placement: 'right',
    },
  ];

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenFeatureTour');
    
    // Only start the tour if the welcome modal has been viewed but the tour hasn't
    const hasSeenWelcome = localStorage.getItem('hasSeenDashboardWelcome');
    
    if (hasSeenWelcome && !hasSeenTour) {
      // Small delay to ensure dashboard is rendered
      const timer = setTimeout(() => {
        setActiveTour(true);
        positionTooltip();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (activeTour) {
      positionTooltip();
      
      // Add resize listener to reposition tooltip if window size changes
      window.addEventListener('resize', positionTooltip);
      return () => window.removeEventListener('resize', positionTooltip);
    }
  }, [activeTour, currentStep]);

  const positionTooltip = () => {
    if (!activeTour) return;
    
    const currentTarget = document.querySelector(tourSteps[currentStep].target);
    if (!currentTarget) return;
    
    const rect = currentTarget.getBoundingClientRect();
    const placement = tourSteps[currentStep].placement || 'bottom';
    
    let style: Record<string, any> = {
      position: 'absolute',
      zIndex: 50,
    };
    
    // Add a subtle highlight to the current target
    currentTarget.classList.add('tour-highlight');
    
    // Calculate position based on placement
    switch (placement) {
      case 'top':
        style.bottom = `${window.innerHeight - rect.top + 10}px`;
        style.left = `${rect.left + rect.width / 2}px`;
        style.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        style.top = `${rect.bottom + 10}px`;
        style.left = `${rect.left + rect.width / 2}px`;
        style.transform = 'translateX(-50%)';
        break;
      case 'left':
        style.top = `${rect.top + rect.height / 2}px`;
        style.right = `${window.innerWidth - rect.left + 10}px`;
        style.transform = 'translateY(-50%)';
        break;
      case 'right':
        style.top = `${rect.top + rect.height / 2}px`;
        style.left = `${rect.right + 10}px`;
        style.transform = 'translateY(-50%)';
        break;
    }
    
    setTooltipStyle(style);
    
    // Remove highlight from previous elements
    document.querySelectorAll('.tour-highlight').forEach(el => {
      if (el !== currentTarget) {
        el.classList.remove('tour-highlight');
      }
    });
  };
  
  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const endTour = () => {
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    setActiveTour(false);
    localStorage.setItem('hasSeenFeatureTour', 'true');
  };
  
  if (!activeTour) return null;
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
        onClick={endTour}
      />
      
      {/* Tooltip */}
      <div 
        className="bg-white p-4 rounded-lg shadow-lg border border-jess-subtle/50 w-72 z-50 animate-fade-in"
        style={tooltipStyle}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-jess-primary">{tourSteps[currentStep].title}</h3>
          <button
            onClick={endTour}
            className="text-jess-muted hover:text-jess-foreground transition-colors rounded-full p-1 hover:bg-jess-subtle/20"
          >
            <X size={16} />
          </button>
        </div>
        
        <p className="text-sm text-jess-muted mb-4">{tourSteps[currentStep].content}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: tourSteps.length }).map((_, index) => (
              <div 
                key={index}
                className={`h-1 w-4 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-jess-primary' 
                    : index < currentStep 
                    ? 'bg-jess-secondary' 
                    : 'bg-jess-subtle'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={prevStep}
                className="h-8 px-3"
              >
                <ChevronLeft size={16} />
                <span className="sr-only">Previous</span>
              </Button>
            )}
            
            <Button 
              size="sm" 
              onClick={nextStep}
              className="h-8 bg-jess-primary hover:bg-jess-primary/90 px-3"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>Finish</>
              ) : (
                <>Next</>
              )}
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
