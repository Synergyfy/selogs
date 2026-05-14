import api from './api';
import type {
  GlobalStats,
  TrendData,
  Organization,
  GlobalInvoice,
  GlobalSettings,
  UpdateGlobalSettingsDto,
  Plan,
  CreatePlanDto,
  UpdatePlanDto,
} from '../types/super-admin';

export const SuperAdminService = {
  getGlobalStats: async (): Promise<GlobalStats> => {
    const response = await api.get('/analytics/global/overview');
    return response.data;
  },

  getGlobalTrends: async (days: number = 30): Promise<TrendData[]> => {
    const response = await api.get('/analytics/global/trends', {
      params: { days },
    });
    return response.data;
  },

  getOrganizations: async (): Promise<Organization[]> => {
    const response = await api.get('/organizations');
    return response.data;
  },

  getGlobalRevenue: async (): Promise<{ totalRevenue: number; currency: string }> => {
    const response = await api.get('/billing/global/revenue');
    return response.data;
  },

  getGlobalInvoices: async (
    page: number = 1,
    limit: number = 20
  ): Promise<{ items: GlobalInvoice[]; total: number }> => {
    const response = await api.get('/billing/global/invoices', {
      params: { page, limit },
    });
    return response.data;
  },

  getGlobalSettings: async (): Promise<GlobalSettings> => {
    const response = await api.get('/settings/global');
    return response.data;
  },

  updateGlobalSettings: async (data: UpdateGlobalSettingsDto): Promise<GlobalSettings> => {
    const response = await api.patch('/settings/global', data);
    return response.data;
  },

  getPlans: async (): Promise<Plan[]> => {
    const response = await api.get('/plans');
    return response.data;
  },

  createPlan: async (data: CreatePlanDto): Promise<Plan> => {
    const response = await api.post('/plans', data);
    return response.data;
  },

  updatePlan: async (id: string, data: UpdatePlanDto): Promise<Plan> => {
    const response = await api.patch(`/plans/${id}`, data);
    return response.data;
  },

  deletePlan: async (id: string): Promise<void> => {
    await api.delete(`/plans/${id}`);
  },
};
