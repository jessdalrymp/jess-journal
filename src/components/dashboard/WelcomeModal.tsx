
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export const DashboardWelcomeModal = () => {
  const [open, setOpen] = useState(false);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            Welcome to JESS <Sparkles className="h-5 w-5 text-jess-primary" />
          </DialogTitle>
          <DialogDescription>
            Your personal AI journaling coach is here to help you explore your thoughts and feelings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-2">
          <div className="bg-jess-subtle/50 p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-1 text-jess-foreground">Journal Challenge</h3>
            <p className="text-xs">Respond to personalized prompts designed to help you reflect and grow</p>
          </div>
          
          <div className="bg-jess-subtle/50 p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-1 text-jess-foreground">My Story</h3>
            <p className="text-xs">Explore your personal narrative through guided storytelling</p>
          </div>
          
          <div className="bg-jess-subtle/50 p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-1 text-jess-foreground">Side Quest</h3>
            <p className="text-xs">Embark on creative journaling adventures to gain new perspectives</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleClose} className="w-full sm:w-auto interactive-button">
            Let's Begin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
