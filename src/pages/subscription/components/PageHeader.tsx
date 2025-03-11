
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PageHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mb-6">
      <Button 
        variant="ghost" 
        className="mr-4" 
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </Button>
      <h1 className="text-2xl font-medium">Subscription</h1>
    </div>
  );
};
