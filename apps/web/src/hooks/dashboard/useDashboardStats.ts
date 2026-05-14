import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../../services/DashboardService';
import type { DashboardOverview, DashboardTrend } from '../../types/dashboard';

export const useDashboardOverview = () => {
  return useQuery<DashboardOverview, Error>({
    queryKey: ['dashboard', 'overview'],
    queryFn: DashboardService.getOverview,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useDashboardTrends = (days: number = 7) => {
  return useQuery<DashboardTrend[], Error>({
    queryKey: ['dashboard', 'trends', days],
    queryFn: () => DashboardService.getTrends(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
