
import React from 'react';
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MessageSquare, MessageSquareText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AnswerLengthToggleProps {
  brevity: 'short' | 'detailed';
  onToggle: (value: 'short' | 'detailed') => void;
}

export const AnswerLengthToggle = ({ brevity, onToggle }: AnswerLengthToggleProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center">
        <span className="text-xs text-jess-muted mr-2">Answers:</span>
        <ToggleGroup type="single" value={brevity} onValueChange={(value) => value && onToggle(value as 'short' | 'detailed')}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="short" aria-label="Short answers" className="h-8 w-8 p-0">
                <MessageSquare className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Short, concise responses</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="detailed" aria-label="Detailed answers" className="h-8 w-8 p-0">
                <MessageSquareText className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Detailed, thorough responses</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </div>
    </TooltipProvider>
  );
};
