
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { User } from "../../lib/types";

interface AccountHeaderProps {
  user: User | null | undefined;
}

export const AccountHeader = ({ user }: AccountHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-medium">Account</h1>
      </div>
      
      <div className="flex flex-col items-center mb-6 pb-6 border-b border-jess-subtle">
        <h2 className="text-xl font-medium">{user?.name || 'User'}</h2>
        <p className="text-jess-muted">{user?.email}</p>
      </div>
    </>
  );
};
