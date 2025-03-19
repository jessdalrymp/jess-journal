
import { AuthFormHeader } from './AuthFormHeader';

interface VerificationScreenProps {
  email: string;
  onBackToSignIn: () => void;
}

export const VerificationScreen = ({ email, onBackToSignIn }: VerificationScreenProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <AuthFormHeader />
      
      <div className="card-base animate-fade-in">
        <div className="text-center p-6">
          <div className="mb-6 mx-auto w-16 h-16 bg-jess-subtle/30 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-jess-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-medium mb-3">Check Your Email</h2>
          <p className="text-jess-muted mb-6">
            We've sent a verification link to <strong>{email}</strong>. 
            Please check your inbox (and spam folder) to verify your account.
          </p>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md text-sm text-yellow-800">
              <p className="font-medium">Note:</p>
              <p>If you don't receive the email within a few minutes:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Check your spam/junk folder</li>
                <li>Make sure you entered your email correctly</li>
                <li>Try signing in with your credentials</li>
              </ul>
            </div>
            <button
              onClick={onBackToSignIn}
              className="text-jess-primary hover:underline text-sm transition-colors"
            >
              Return to sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
