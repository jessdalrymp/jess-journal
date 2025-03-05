
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";
import { ActionButton } from "../ui/ActionButton";

interface ChallengeDisplayProps {
  challenge: {
    title: string;
    steps: string[];
  };
  onBack: () => void;
  onAcceptChallenge: () => void;
  onNewChallenge: () => void;
  isLoading: boolean;
}

export const ChallengeDisplay = ({ 
  challenge, 
  onBack, 
  onAcceptChallenge, 
  onNewChallenge,
  isLoading 
}: ChallengeDisplayProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-jess-subtle flex items-center">
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
      
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Generating your challenge...</p>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-3">{challenge.title}</h1>
            <h3 className="text-lg font-medium mb-2">Steps to complete:</h3>
            <ol className="list-decimal pl-6 space-y-1.5">
              {challenge.steps.map((step, index) => (
                <li key={index} className="text-base">{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-jess-subtle flex justify-center gap-4">
        <ActionButton 
          onClick={onAcceptChallenge}
          type="primary"
          className="shadow-md px-5 py-2.5 text-base"
          icon={<CheckCircle className="h-5 w-5" />}
          disabled={isLoading}
        >
          Accept Challenge
        </ActionButton>
        
        <ActionButton 
          onClick={onNewChallenge}
          type="secondary"
          className="shadow-md px-5 py-2.5 text-base"
          icon={<RefreshCw className="h-5 w-5" />}
          disabled={isLoading}
        >
          Get New Challenge
        </ActionButton>
      </div>
    </div>
  );
};
