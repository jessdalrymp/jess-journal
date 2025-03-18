
import { useToast } from "../../../hooks/use-toast";

/**
 * Shows error notification using toast
 */
export const showErrorNotification = (toast: ReturnType<typeof useToast>["toast"], title: string, description: string) => {
  toast({
    title,
    description,
    variant: "destructive"
  });
};
