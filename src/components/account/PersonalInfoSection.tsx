
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../ui/input";
import { useUserData } from "../../context/UserDataContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../../integrations/supabase/client";

interface PersonalInfoSectionProps {
  onSave?: (name: string) => void;
}

export const PersonalInfoSection = ({ onSave }: PersonalInfoSectionProps) => {
  const { user } = useAuth();
  const { saveProfile } = useUserData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedName(user?.name || '');
  };

  const handleSavePersonalInfo = async () => {
    if (!editedName.trim()) {
      toast({
        title: "Name cannot be empty",
        description: "Please enter a valid name",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update auth metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { name: editedName }
      });
      
      if (metadataError) {
        throw metadataError;
      }
      
      // Call the onSave prop which updates the local UI state
      if (onSave) {
        onSave(editedName);
      }
      
      toast({
        title: "Profile updated",
        description: "Your name has been updated successfully"
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error saving profile",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 border border-jess-subtle rounded-lg">
      <h3 className="font-medium mb-3 flex items-center">
        <Pencil size={18} className="mr-2" />
        Edit Personal Information
      </h3>
      
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <Input
              type="text"
              id="name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full bg-jess-subtle text-jess-foreground"
              placeholder="Enter your name"
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleSavePersonalInfo} 
              className="bg-jess-primary hover:bg-jess-primary/90"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleEditToggle}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-jess-muted mb-3">Update your personal details</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleEditToggle}
          >
            <Pencil size={14} className="mr-2" />
            Edit Details
          </Button>
        </div>
      )}
    </div>
  );
};
