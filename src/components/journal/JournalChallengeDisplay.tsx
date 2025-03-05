
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, RefreshCw, MessageSquare, Pen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface JournalPrompt {
  title: string;
  prompt: string;
  instructions: string[];
}

interface JournalChallengeDisplayProps {
  journalPrompt: JournalPrompt;
  onBack: () => void;
  onAcceptChallenge: () => void;
  onNewChallenge: () => void;
  onStartChat: () => void;
  isLoading: boolean;
}

export const JournalChallengeDisplay = ({
  journalPrompt,
  onBack,
  onAcceptChallenge,
  onNewChallenge,
  onStartChat,
  isLoading
}: JournalChallengeDisplayProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-medium font-cormorant">Journal Challenge</h2>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Badge variant="outline" className="px-2.5 py-0.5 bg-jess-subtle text-jess-primary">
              <BookOpen className="mr-1 h-3.5 w-3.5" />
              Writing Prompt
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNewChallenge}
              disabled={isLoading}
              className="font-sourcesans"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Generating..." : "Get New Prompt"}
            </Button>
          </div>

          <Card className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <h1 className="text-2xl font-bold text-jess-primary mb-4 font-cormorant">{journalPrompt.title}</h1>
            
            <div className="bg-jess-subtle p-5 rounded-lg mb-6">
              <p className="text-lg font-medium font-sourcesans">{journalPrompt.prompt}</p>
            </div>
            
            <h3 className="font-semibold text-gray-700 mb-3 font-cormorant">Instructions:</h3>
            <ol className="space-y-3 list-decimal pl-5 font-sourcesans">
              {journalPrompt.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-600">{instruction}</li>
              ))}
            </ol>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onAcceptChallenge} 
              className="bg-jess-primary hover:bg-jess-primary/90 text-white font-sourcesans"
              size="lg"
            >
              <Pen className="mr-2 h-5 w-5" />
              Start Journaling
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onStartChat}
              size="lg"
              className="font-sourcesans"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with Jess
            </Button>
          </div>

          <Separator className="my-8" />

          <div className="bg-jess-subtle p-5 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3 font-cormorant">Journal Progress Tracker</h3>
            <p className="text-gray-600 mb-4 font-sourcesans">Track your journaling progress and view your previous entries to see how your thoughts and insights have evolved over time.</p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/journal-history'}
              className="w-full font-sourcesans"
            >
              View Journal History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
