
interface AuthFormToggleProps {
  isLogin: boolean;
  onToggleMode: () => void;
}

export const AuthFormToggle = ({ isLogin, onToggleMode }: AuthFormToggleProps) => {
  return (
    <div className="text-center mt-4">
      <button
        type="button"
        onClick={onToggleMode}
        className="text-jess-primary hover:underline text-sm"
      >
        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
      </button>
    </div>
  );
};
