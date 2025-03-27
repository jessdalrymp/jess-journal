
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { AuthFormToggle } from './AuthFormToggle';

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
        <LoginForm onForgotPassword={onForgotPassword} />
      ) : (
        <SignUpForm onVerificationSent={onVerificationSent} />
      )}

      <AuthFormToggle isLogin={isLogin} onToggleMode={onToggleMode} />
    </>
  );
};
