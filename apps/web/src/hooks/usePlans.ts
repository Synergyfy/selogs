import { useQuery } from '@tanstack/react-query';
import { SuperAdminService } from '../services/SuperAdminService';
import type { Plan } from '../types/super-admin';

export const usePlans = () => {
  return useQuery<Plan[], Error>({
    queryKey: ['plans'],
    queryFn: SuperAdminService.getPlans,
  });
};
