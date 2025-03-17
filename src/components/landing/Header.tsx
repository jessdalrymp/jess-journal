
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
        <div className="hidden md:flex space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-[#8B5CF6] hover:text-[#8B5CF6]/90 hover:bg-[#F2FCE2]/50">Login</Button>
          </Link>
          <Link to="/dashboard">
            <Button className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
