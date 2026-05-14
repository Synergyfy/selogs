import { useQuery } from '@tanstack/react-query';
import { SuperAdminService } from '../../services/SuperAdminService';

export const useGlobalRevenue = () => {
  return useQuery<{ totalRevenue: number; currency: string }, Error>({
    queryKey: ['super-admin', 'global-revenue'],
    queryFn: SuperAdminService.getGlobalRevenue,
    staleTime: 1000 * 60 * 5,
  });
};
