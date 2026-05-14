import { useQuery } from '@tanstack/react-query';
import { SuperAdminService } from '../../services/SuperAdminService';
import type { GlobalStats } from '../../types/super-admin';

export const useGlobalStats = () => {
  return useQuery<GlobalStats, Error>({
    queryKey: ['super-admin', 'global-stats'],
    queryFn: SuperAdminService.getGlobalStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
