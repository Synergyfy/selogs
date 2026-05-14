import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SuperAdminService } from '../../services/SuperAdminService';
import type { CreatePlanDto } from '../../types/super-admin';

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanDto) => SuperAdminService.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'plans'] });
    },
  });
};
