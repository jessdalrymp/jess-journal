
import { useAdminStatus } from './useAdminStatus';
import { usePlanFetching } from './usePlanFetching';
import { usePlanOperations } from './usePlanOperations';

export const usePlanManagement = () => {
  const { isAdmin, loading: adminLoading } = useAdminStatus();
  const { plans, loading: plansLoading, connectionError, fetchPlans } = usePlanFetching();
  const {
    isDialogOpen,
    setIsDialogOpen,
    editingPlan,
    formData,
    handleInputChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSubmit
  } = usePlanOperations(fetchPlans, isAdmin);

  // Combine loadings to determine overall loading state
  const loading = adminLoading || plansLoading;

  return {
    plans,
    loading,
    isAdmin,
    isDialogOpen,
    setIsDialogOpen,
    editingPlan,
    formData,
    handleInputChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSubmit,
    connectionError
  };
};
