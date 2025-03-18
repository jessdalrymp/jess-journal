
interface ToggleAuthModeProps {
  isLogin: boolean;
  onToggleMode: () => void;
}

export const ToggleAuthMode = ({ isLogin, onToggleMode }: ToggleAuthModeProps) => {
  return (
    <div className="mt-6 text-center">
      <button
        onClick={onToggleMode}
        className="text-jess-primary hover:underline text-sm transition-colors"
      >
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"
        }
      </button>
    </div>
  );
};
