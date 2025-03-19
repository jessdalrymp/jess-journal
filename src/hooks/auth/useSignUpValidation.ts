
import { useState } from 'react';
import { validateEmail, validatePassword, validateName } from '../../utils/authValidation';

export const useSignUpValidation = () => {
  const [error, setError] = useState<string | null>(null);

  const validateForm = (email: string, password: string, confirmPassword: string, name: string): boolean => {
    setError(null);
    
    if (!email || !password || !name) {
      setError("Please fill in all required fields.");
      return false;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (!validateName(name)) {
      setError("Please enter your name to create an account.");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  return { error, setError, validateForm };
};
