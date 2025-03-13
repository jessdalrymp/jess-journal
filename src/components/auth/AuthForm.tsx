
import { useState } from 'react';
import { AuthFormContainer } from './AuthFormContainer';
import { LoginSignUpForm } from './LoginSignUpForm';
import { VerificationScreen } from './VerificationScreen';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleVerificationSent = (email: string) => {
    setVerificationEmail(email);
    setVerificationSent(true);
  };

  const handleBackToSignIn = () => {
    setVerificationSent(false);
    setIsLogin(true);
  };

  // Render a special message when verification email has been sent
  if (verificationSent) {
    return (
      <VerificationScreen 
        email={verificationEmail} 
        onBackToSignIn={handleBackToSignIn} 
      />
    );
  }

  return (
    <>
      <AuthFormContainer>
        <LoginSignUpForm 
          isLogin={isLogin}
          onToggleMode={handleToggleMode}
          onForgotPassword={handleForgotPassword}
          onVerificationSent={handleVerificationSent}
        />
      </AuthFormContainer>
      
      <ForgotPasswordDialog 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </>
  );
};
