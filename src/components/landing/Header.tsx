
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthFormHeader } from '../auth/AuthFormHeader';

export const Header = () => {
  return (
    <header className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <AuthFormHeader />
        <div className="hidden md:flex space-x-4">
          <Link to="/">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
