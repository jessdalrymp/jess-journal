
import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";

interface BackToDashboardButtonProps {
  className?: string;
}

export const BackToDashboardButton = ({ className = "" }: BackToDashboardButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="ghost" 
      className={`mr-4 ${className}`}
      onClick={() => navigate('/')}
    >
      <ArrowLeft size={18} className="mr-2" />
      Back to Dashboard
    </Button>
  );
};
