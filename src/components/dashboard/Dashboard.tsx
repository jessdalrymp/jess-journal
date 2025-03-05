
import { useState } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { MoodCheck } from './MoodCheck';
import { ChatInterface } from '../chat/ChatInterface';
import { JournalHistory } from '../journal/JournalHistory';
import { BookOpen, MessageSquare, Zap, PenLine, Smile } from 'lucide-react';
import { ActionButton } from '../ui/ActionButton';

export const Dashboard = () => {
  const { profile } = useUserData();
  const [activeChat, setActiveChat] = useState<'story' | 'sideQuest' | 'action' | 'journal' | null>(null);

  const handleStartChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
    setActiveChat(type);
  };

  const handleBackToDashboard = () => {
    setActiveChat(null);
  };

  if (activeChat) {
    return (
      <div className="h-full">
        <ChatInterface type={activeChat} onBack={handleBackToDashboard} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-serif font-medium mb-4">Your Growth Journey</h1>
        <p className="text-xl text-jess-foreground mb-8">
          Choose a path to continue your personal transformation with JESS
        </p>
        
        <div className="max-w-md mx-auto">
          <button className="flex items-center gap-2 border border-jess-subtle px-4 py-2 rounded-full w-full justify-center text-jess-foreground">
            <Smile className="text-jess-primary" size={20} />
            How are you feeling?
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card-base p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-jess-accent/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-jess-primary" size={24} />
          </div>
          <h3 className="font-serif text-2xl mb-3">My Story</h3>
          <p className="text-jess-muted mb-6">
            Begin a deep dive into your life story to gain better understanding of yourself.
          </p>
          <ActionButton 
            type="secondary" 
            onClick={() => handleStartChat('story')}
            className="w-full"
          >
            Begin
          </ActionButton>
        </div>
        
        <div className="card-base p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-jess-accent/20 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-jess-primary" size={24} />
          </div>
          <h3 className="font-serif text-2xl mb-3">Side Quest</h3>
          <p className="text-jess-muted mb-6">
            Delve into a current issue you're working through to gain better self-understanding.
          </p>
          <ActionButton 
            type="secondary" 
            onClick={() => handleStartChat('sideQuest')}
            className="w-full"
          >
            Begin
          </ActionButton>
        </div>
        
        <div className="card-base p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-jess-accent/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="text-jess-primary" size={24} />
          </div>
          <h3 className="font-serif text-2xl mb-3">Action Challenge</h3>
          <p className="text-jess-muted mb-6">
            Get a personalized real-world challenge to create breakthrough moments.
          </p>
          <ActionButton 
            type="secondary" 
            onClick={() => handleStartChat('action')}
            className="w-full"
          >
            Begin
          </ActionButton>
        </div>
        
        <div className="card-base p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-jess-accent/20 flex items-center justify-center mx-auto mb-4">
            <PenLine className="text-jess-primary" size={24} />
          </div>
          <h3 className="font-serif text-2xl mb-3">Journal Challenge</h3>
          <p className="text-jess-muted mb-6">
            Receive thought-provoking writing prompts for deeper self-reflection.
          </p>
          <ActionButton 
            type="secondary" 
            onClick={() => handleStartChat('journal')}
            className="w-full"
          >
            Begin
          </ActionButton>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-jess-subtle/50 rounded-xl text-center border border-jess-subtle">
        <p className="text-jess-muted text-sm leading-relaxed">
          JESS helps you process your stories, reframe limiting beliefs, and take actionable steps toward real change — just like chatting with a wise, warm friend who guides you toward deeper awareness.
        </p>
      </div>
    </div>
  );
};
