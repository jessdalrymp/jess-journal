
import { useState } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { MoodCheck } from './MoodCheck';
import { ChatInterface } from '../chat/ChatInterface';
import { JournalHistory } from '../journal/JournalHistory';
import { ActionButton } from '../ui/ActionButton';
import { BookOpen, MessageSquare, Zap, PenLine, Smile } from 'lucide-react';

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
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-cormorant mb-3">Your Growth Journey</h1>
        <p className="text-jess-muted text-lg">
          Choose a path to continue your personal transformation with JESS
        </p>
        <p className="text-sm text-jess-foreground/70 mt-2 font-light">
          Rewrite your story, one conversation at a time.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <button className="flex items-center gap-2 px-6 py-2 border border-jess-subtle/50 rounded-full hover:bg-jess-subtle/20 transition-colors">
          <Smile size={18} />
          <span>How are you feeling?</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center border border-jess-subtle/30 sketch-border">
          <div className="w-16 h-16 bg-jess-accent rounded-full flex items-center justify-center mb-6">
            <BookOpen className="text-jess-foreground" size={28} />
          </div>
          <h3 className="font-cormorant text-2xl mb-3">My Story</h3>
          <p className="text-jess-muted mb-6">
            Begin a deep dive into your life story to gain better understanding of yourself.
          </p>
          <button 
            onClick={() => handleStartChat('story')}
            className="bg-jess-secondary text-jess-foreground px-8 py-2 rounded-full hover:bg-jess-secondary/80 transition-colors"
          >
            Begin
          </button>
        </div>
        
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center border border-jess-subtle/30 sketch-border">
          <div className="w-16 h-16 bg-jess-accent rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="text-jess-foreground" size={28} />
          </div>
          <h3 className="font-cormorant text-2xl mb-3">Side Quest</h3>
          <p className="text-jess-muted mb-6">
            Delve into a current issue you're working through to gain better self-understanding.
          </p>
          <button 
            onClick={() => handleStartChat('sideQuest')}
            className="bg-jess-secondary text-jess-foreground px-8 py-2 rounded-full hover:bg-jess-secondary/80 transition-colors"
          >
            Begin
          </button>
        </div>
        
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center border border-jess-subtle/30 sketch-border">
          <div className="w-16 h-16 bg-jess-accent rounded-full flex items-center justify-center mb-6">
            <Zap className="text-jess-foreground" size={28} />
          </div>
          <h3 className="font-cormorant text-2xl mb-3">Action Challenge</h3>
          <p className="text-jess-muted mb-6">
            Get a personalized real-world challenge to create breakthrough moments.
          </p>
          <button 
            onClick={() => handleStartChat('action')}
            className="bg-jess-secondary text-jess-foreground px-8 py-2 rounded-full hover:bg-jess-secondary/80 transition-colors"
          >
            Begin
          </button>
        </div>
        
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center border border-jess-subtle/30 sketch-border">
          <div className="w-16 h-16 bg-jess-accent rounded-full flex items-center justify-center mb-6">
            <PenLine className="text-jess-foreground" size={28} />
          </div>
          <h3 className="font-cormorant text-2xl mb-3">Journal Challenge</h3>
          <p className="text-jess-muted mb-6">
            Receive thought-provoking writing prompts for deeper self-reflection.
          </p>
          <button 
            onClick={() => handleStartChat('journal')}
            className="bg-jess-secondary text-jess-foreground px-8 py-2 rounded-full hover:bg-jess-secondary/80 transition-colors"
          >
            Begin
          </button>
        </div>
      </div>
      
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <p className="text-sm text-jess-muted leading-relaxed">
          JESS helps you process your stories, reframe limiting beliefs, and take actionable 
          steps toward real change — just like chatting with a wise, warm friend who guides 
          you toward deeper awareness.
        </p>
      </div>
    </div>
  );
};
