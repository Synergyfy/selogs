import api from './api';
import type { DashboardOverview, DashboardTrend } from '../types/dashboard';

export const DashboardService = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  getTrends: async (days: number = 7): Promise<DashboardTrend[]> => {
    const response = await api.get('/analytics/trends', {
      params: { days },
    });
    return response.data;
  },
};
