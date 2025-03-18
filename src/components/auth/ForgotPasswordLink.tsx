
interface ForgotPasswordLinkProps {
  onForgotPassword: () => void;
}

export const ForgotPasswordLink = ({ onForgotPassword }: ForgotPasswordLinkProps) => {
  return (
    <div className="text-right">
      <button
        type="button"
        onClick={onForgotPassword}
        className="text-jess-primary hover:underline text-sm transition-colors"
      >
        Forgot password?
      </button>
    </div>
  );
};
