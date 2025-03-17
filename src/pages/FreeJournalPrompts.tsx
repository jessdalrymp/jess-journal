
import React from 'react';
import { Header } from '../components/landing/Header';
import { Footer } from '../components/landing/Footer';
import { FreeJournalPromptsContent } from '../components/journal/FreeJournalPromptsContent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FreeJournalPrompts = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-jess-subtle/30 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-jess-foreground">Free Journal Prompts</h1>
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6 text-center">
              <p className="text-jess-foreground/80 mb-2">
                Browse and use these daily journaling prompts completely free.
              </p>
              <p className="text-sm text-jess-foreground/70">
                Copy any prompt you like and paste it into your favorite document editor.
              </p>
            </div>
            
            <FreeJournalPromptsContent />
            
            <div className="mt-12 border-t pt-6 text-center">
              <h3 className="font-medium mb-2">Want more personalized prompts and save your entries?</h3>
              <p className="text-sm mb-4">Sign up for a full account to access AI-generated prompts based on your writing.</p>
              <Link to="/dashboard">
                <Button>Try Jess for Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FreeJournalPrompts;
