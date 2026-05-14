import { useQuery } from '@tanstack/react-query';
import { SuperAdminService } from '../../services/SuperAdminService';
import type { TrendData } from '../../types/super-admin';

export const useGlobalTrends = (days: number = 30) => {
  return useQuery<TrendData[], Error>({
    queryKey: ['super-admin', 'global-trends', days],
    queryFn: () => SuperAdminService.getGlobalTrends(days),
    staleTime: 1000 * 60 * 5,
  });
};
