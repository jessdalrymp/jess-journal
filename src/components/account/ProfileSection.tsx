
import { Settings } from "lucide-react";
import { User } from "../../lib/types";

interface ProfileSectionProps {
  user: User | null | undefined;
}

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  return (
    <div className="p-4 border border-jess-subtle rounded-lg">
      <h3 className="font-medium mb-3 flex items-center">
        <Settings size={18} className="mr-2" />
        Profile Settings
      </h3>
      <p className="text-sm text-jess-muted mb-2">Email: {user?.email}</p>
      <p className="text-sm text-jess-muted">Member since: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
    </div>
  );
};
