import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SuperAdminService } from '../../services/SuperAdminService';
import type { UpdatePlanDto } from '../../types/super-admin';

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanDto }) => 
      SuperAdminService.updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'plans'] });
    },
  });
};
