
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAdminStatus } from "../hooks/useAdminStatus";

export const AdminHeader = () => {
  const navigate = useNavigate();
  const { isAdmin, loading, makeAdmin } = useAdminStatus();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-medium">Admin Panel</h1>
      </div>
      
      {!isAdmin && !loading && (
        <Button 
          variant="outline"
          onClick={makeAdmin}
          disabled={loading}
        >
          Make Me Admin
        </Button>
      )}
    </div>
  );
};
