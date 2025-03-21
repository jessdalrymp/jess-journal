
import { useState } from 'react';
import { useToast } from "../../../../hooks/use-toast";
import { deleteUserInDB } from "../../services/userService";

export const useUserDeletion = (onUserUpdate: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const deleteUser = async (userId: string, email: string) => {
    try {
      setLoading(true);
      console.log(`Attempting to delete user: ${email} (${userId})`);
      
      const { success, error } = await deleteUserInDB(userId);
      
      if (!success || error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error deleting user",
          description: error?.message || "Could not delete user",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "User deleted",
        description: `User ${email} has been deleted`,
      });
      
      onUserUpdate();
      return true;
    } catch (error: any) {
      console.error('Error in deleteUser:', error);
      toast({
        title: "Error deleting user",
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
    deleteUser
  };
};
