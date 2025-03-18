
import React from 'react';
import { AuthFormContainer } from './AuthFormContainer';
import { ResetPasswordForm } from './ResetPasswordForm';

export const ResetPasswordPage = () => {
  return (
    <AuthFormContainer>
      <h2 className="text-2xl font-medium mb-6 text-center">Reset Your Password</h2>
      <p className="text-center text-jess-muted mb-6">
        Enter your new password below to reset your password.
      </p>
      <ResetPasswordForm />
    </AuthFormContainer>
  );
};
