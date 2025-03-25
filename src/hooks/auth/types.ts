
import { User, Session } from '@supabase/supabase-js';

export interface SignUpResult {
  user?: User;
  session?: Session;
  exists?: boolean;
  emailVerificationRequired?: boolean;
  emailSent?: boolean;
}

export interface ProfileCreationResult {
  success: boolean;
  error?: any;
}

export interface EmailVerificationResult {
  success: boolean;
  rateLimit?: boolean;
  error?: any;
}
