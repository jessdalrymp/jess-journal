
import { useState } from "react";
import { Settings, MessageCircle } from "lucide-react";
import { User } from "../../lib/types";
import { LegalLinks } from "../common/LegalLinks";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "./ContactDialog";

interface ProfileSectionProps {
  user: User | null | undefined;
}

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  
  return (
    <div className="p-4 border border-jess-subtle rounded-lg">
      <h3 className="font-medium mb-3 flex items-center">
        <Settings size={18} className="mr-2" />
        Profile Settings
      </h3>
      <p className="text-sm text-jess-muted mb-2">Email: {user?.email}</p>
      <p className="text-sm text-jess-muted mb-4">Member since: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-4 text-jess-primary"
        onClick={() => setContactDialogOpen(true)}
      >
        <MessageCircle size={16} className="mr-2" />
        Contact Support
      </Button>
      
      <div className="pt-3 border-t border-jess-subtle">
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
