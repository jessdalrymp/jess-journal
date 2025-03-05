
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, CheckCircle, BookOpen } from "lucide-react";
import { ActionButton } from "../ui/ActionButton";

interface ChallengeDisplayProps {
  challenge: {
    title: string;
    steps: string[];
  };
  onBack: () => void;
  onAcceptChallenge: () => void;
  onNewChallenge: () => void;
  onStartJournaling?: () => void;
  isLoading: boolean;
}

export const ChallengeDisplay = ({ 
  challenge, 
  onBack, 
  onAcceptChallenge, 
  onNewChallenge,
  onStartJournaling,
  isLoading 
}: ChallengeDisplayProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-jess-subtle flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-medium">Action Challenge</h2>
      </div>
      
      <div className="flex-1 p-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-lg">Generating your challenge...</p>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-bold mb-2">{challenge.title}</h1>
            <h3 className="text-base font-medium mb-1.5">Steps to complete:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              {challenge.steps.map((step, index) => (
                <li key={index} className="text-sm leading-tight">{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
      
      <div className="p-2 border-t border-jess-subtle flex justify-center gap-3">
        <ActionButton 
          onClick={onAcceptChallenge}
          type="primary"
          className="shadow-md px-4 py-2 text-sm"
          icon={<CheckCircle className="h-4 w-4" />}
          disabled={isLoading}
        >
          Accept Challenge
        </ActionButton>
        
        {onStartJournaling && (
          <ActionButton 
            onClick={onStartJournaling}
            type="secondary"
            className="shadow-md px-4 py-2 text-sm"
            icon={<BookOpen className="h-4 w-4" />}
            disabled={isLoading}
          >
            Journal
          </ActionButton>
        )}
        
        <ActionButton 
          onClick={onNewChallenge}
          type="secondary"
          className="shadow-md px-4 py-2 text-sm"
          icon={<RefreshCw className="h-4 w-4" />}
          disabled={isLoading}
        >
          Get New Challenge
        </ActionButton>
      </div>
    </div>
  );
};
