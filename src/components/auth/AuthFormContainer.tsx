
import React from 'react';

interface AuthFormContainerProps {
  children: React.ReactNode;
}

export const AuthFormContainer = ({ children }: AuthFormContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-jess-background p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-jess-subtle/30 animate-fade-in">
        <div className="flex justify-center mb-6">
          <img 
            src="/favicon.svg" 
            alt="Jess Journal Logo" 
            className="h-12 sm:h-14 w-auto" 
          />
        </div>
        
        {children}
      </div>
      
      <div className="mt-6 text-center text-sm text-jess-muted">
        <p>Jess Journal © {new Date().getFullYear()} – All rights reserved.</p>
      </div>
    </div>
  );
};
