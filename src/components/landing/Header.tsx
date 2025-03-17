
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthFormHeader } from '../auth/AuthFormHeader';

export const Header = () => {
  return (
    <header className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <Link to="/dashboard">
          <AuthFormHeader />
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          <span className="text-sm font-medium text-jess-accent">Use code <span className="font-mono bg-black/5 px-1.5 py-0.5 rounded">BETA30</span> for 30 days free!</span>
          <Link to="/dashboard">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
