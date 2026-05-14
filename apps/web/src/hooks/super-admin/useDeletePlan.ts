import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SuperAdminService } from '../../services/SuperAdminService';

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SuperAdminService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'plans'] });
    },
  });
};
