
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../ui/input";

interface PersonalInfoSectionProps {
  onSave: (name: string) => void;
}

export const PersonalInfoSection = ({ onSave }: PersonalInfoSectionProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedName(user?.name || '');
  };

  const handleSavePersonalInfo = () => {
    onSave(editedName);
    setIsEditing(false);
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
            >
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={handleEditToggle}
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
