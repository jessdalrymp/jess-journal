
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePasswordReset } from '../../hooks/auth/usePasswordReset';
import { validateEmail } from '../../utils/authValidation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ForgotPasswordFormProps {
  onClose: () => void;
}

export const ForgotPasswordForm = ({ onClose }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { resetPassword, loading } = usePasswordReset();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate email
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    try {
      const success = await resetPassword(email);
      
      if (success) {
        // Close the dialog
        onClose();
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-jess-foreground mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3 py-2 border border-jess-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-jess-primary"
          disabled={loading}
          required
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </span>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </div>
    </form>
  );
};
