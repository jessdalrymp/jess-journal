
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const DisclaimerBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage to see if the user has seen the disclaimer before
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');
    
    // Only show the disclaimer if the user hasn't seen it before
    if (!hasSeenDisclaimer) {
      setIsVisible(true);
    }
  }, []);

  const dismissBanner = () => {
    localStorage.setItem('hasSeenDisclaimer', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-slide-up">
      <div className="max-w-3xl mx-auto bg-jess-warning/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-jess-accent/30">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-lg text-jess-foreground mb-2">Disclaimer</h3>
            <p className="text-sm text-jess-foreground/90">
              "JESS is not a licensed therapist, counselor, or medical professional. The AI interactions within this app are intended for self-reflection, personal growth, and self-coaching purposes only. They do not constitute therapy, counseling, medical diagnosis, or treatment of any kind.<br /><br />
              
              If you are experiencing a mental health crisis, emotional distress, or require professional support, please seek help from a qualified therapist, counselor, or medical professional. If you are in immediate danger or require urgent assistance, please contact emergency services or a crisis helpline in your area.<br /><br />
              
              By using JESS, you acknowledge that this AI is a self-guided coaching tool and does not replace professional mental health support. You are responsible for your own well-being and personal decisions based on interactions with JESS."
            </p>
          </div>
          <button 
            onClick={dismissBanner}
            className="ml-2 p-1 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
