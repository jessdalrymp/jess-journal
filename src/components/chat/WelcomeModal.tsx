
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getInitialMessage } from './chatUtils';
import { Switch } from "@/components/ui/switch";

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  buttonText: string;
  type?: 'story' | 'sideQuest' | 'action' | 'journal';
}

export const WelcomeModal = ({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  buttonText,
  type 
}: WelcomeModalProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const welcomeMessage = type ? getInitialMessage(type) : description;
  
  const handleClose = () => {
    if (dontShowAgain && type) {
      // Save preference to localStorage
      localStorage.setItem(`dontShow${type.charAt(0).toUpperCase() + type.slice(1)}Welcome`, 'true');
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2">{title}</DialogTitle>
          <button 
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {welcomeMessage.split('\n\n').map((paragraph, i) => {
            if (paragraph.includes('•')) {
              const [intro, ...points] = paragraph.split('\n•');
              return (
                <div key={i}>
                  {intro && <p>{intro}</p>}
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    {points.map((point, j) => (
                      <li key={j}>{point}</li>
                    ))}
                  </ul>
                </div>
              );
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </div>
        <div className="mt-6 flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="dont-show-again" 
              checked={dontShowAgain} 
              onCheckedChange={setDontShowAgain}
            />
            <label 
              htmlFor="dont-show-again" 
              className="text-sm text-gray-600 cursor-pointer"
            >
              Don't show this again
            </label>
          </div>
          <button 
            onClick={handleClose}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {buttonText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
