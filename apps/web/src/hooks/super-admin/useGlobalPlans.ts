import { useQuery } from '@tanstack/react-query';
import { SuperAdminService } from '../../services/SuperAdminService';
import type { Plan } from '../../types/super-admin';

export const useGlobalPlans = () => {
  return useQuery<Plan[], Error>({
    queryKey: ['super-admin', 'plans'],
    queryFn: SuperAdminService.getPlans,
  });
};
