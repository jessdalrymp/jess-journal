
import { useState, useEffect } from "react";
import { Settings, MessageCircle, Shield } from "lucide-react";
import { User } from "../../lib/types";
import { LegalLinks } from "../common/LegalLinks";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "./ContactDialog";
import { useAdminStatus } from "../../pages/admin/hooks/useAdminStatus";
import { Link } from "react-router-dom";

interface ProfileSectionProps {
  user: User | null | undefined;
}

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const { isAdmin, loading, makeAdmin } = useAdminStatus();
  
  return (
    <div className="p-4 border border-jess-subtle rounded-lg">
      <h3 className="font-medium mb-3 flex items-center">
        <Settings size={18} className="mr-2" />
        Profile Settings
      </h3>
      <p className="text-sm text-jess-muted mb-2">Email: {user?.email}</p>
      <p className="text-sm text-jess-muted mb-4">Member since: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
      
      <div className="space-y-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-jess-primary"
          onClick={() => setContactDialogOpen(true)}
        >
          <MessageCircle size={16} className="mr-2" />
          Contact Support
        </Button>
        
        {isAdmin ? (
          <Link to="/admin">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center text-jess-primary"
            >
              <Shield size={16} className="mr-2" />
              Admin Dashboard
            </Button>
          </Link>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center justify-center text-jess-primary"
            onClick={makeAdmin}
            disabled={loading}
          >
            <Shield size={16} className="mr-2" />
            {loading ? "Processing..." : "Request Admin Access"}
          </Button>
        )}
      </div>
      
      <div className="pt-3 mt-3 border-t border-jess-subtle">
        <LegalLinks className="mt-2" />
      </div>
      
      <ContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        userEmail={user?.email}
      />
    </div>
  );
};
