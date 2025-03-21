
import { useState } from 'react';
import { useToast } from "../../../../hooks/use-toast";
import { toggleUserAdminStatusInDB } from "../../services/userService";

export const useUserAdminStatus = (onUserUpdate: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggleAdminStatus = async (userId: string, currentAdminStatus: boolean) => {
    try {
      setLoading(true);
      const newAdminStatus = !currentAdminStatus;
      
      const { success, error } = await toggleUserAdminStatusInDB(userId, currentAdminStatus);
      
      if (!success || error) {
        console.error('Error toggling admin status:', error);
        toast({
          title: "Error updating role",
          description: error?.message || "Could not update user role",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Role updated",
        description: `User is now ${newAdminStatus ? 'an admin' : 'a regular user'}`,
      });
      
      onUserUpdate();
      return true;
    } catch (error: any) {
      console.error('Error in toggleAdminStatus:', error);
      toast({
        title: "Error updating role",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    toggleAdminStatus
  };
};
