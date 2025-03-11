
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-jess-primary">JESS</h2>
            <p className="text-jess-muted">Your AI Storytelling Coach</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <Link to="/legal" className="text-jess-muted hover:text-jess-primary">
              Terms & Privacy
            </Link>
            <Link to="/about" className="text-jess-muted hover:text-jess-primary">
              About
            </Link>
            <Link to="/contact" className="text-jess-muted hover:text-jess-primary">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-jess-muted">
          &copy; {new Date().getFullYear()} JESS. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
