
import { ReactNode } from 'react';
import { AuthFormHeader } from './AuthFormHeader';
import { LegalLinks } from '../common/LegalLinks';

interface AuthFormContainerProps {
  children: ReactNode;
  showLegalLinks?: boolean;
}

export const AuthFormContainer = ({ 
  children, 
  showLegalLinks = true 
}: AuthFormContainerProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <AuthFormHeader />
      
      <div className="card-base animate-fade-in">
        {children}
      </div>
      
      {showLegalLinks && (
        <div className="mt-8 space-y-3">
          <p className="text-center text-sm text-jess-muted">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
          
          <LegalLinks className="mt-1" />
        </div>
      )}
    </div>
  );
};
