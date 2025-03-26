
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ToggleAuthMode } from './ToggleAuthMode';

interface LoginSignUpFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onForgotPassword: () => void;
  onVerificationSent: (email: string) => void;
}

export const LoginSignUpForm = ({ 
  isLogin, 
  onToggleMode, 
  onForgotPassword,
  onVerificationSent
}: LoginSignUpFormProps) => {
  return (
    <>
      <h2 className="text-2xl font-medium mb-6 text-center">
        {isLogin ? 'Welcome Back' : 'Create Your Account'}
      </h2>
      
      {isLogin ? (
        <LoginForm 
          onForgotPassword={onForgotPassword}
          onVerificationSent={onVerificationSent}
        />
      ) : (
        <SignUpForm 
          onVerificationSent={onVerificationSent}
        />
      )}
      
      <ToggleAuthMode isLogin={isLogin} onToggleMode={onToggleMode} />
    </>
  );
};
