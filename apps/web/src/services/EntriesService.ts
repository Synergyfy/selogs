import api from './api';
import type { VehicleEntry } from '../types/dashboard';

export interface EntriesParams {
  page?: number;
  limit?: number;
  branchId?: string;
  staffId?: string;
  plateNumber?: string;
  status?: 'IN' | 'OUT';
  startDate?: string;
  endDate?: string;
}

export interface PaginatedEntries {
  data: VehicleEntry[];
  total: number;
  page: number;
  lastPage: number;
}

export const EntriesService = {
  getEntries: async (params?: EntriesParams): Promise<PaginatedEntries> => {
    const response = await api.get('/entries', { params });
    return response.data;
  },

  deleteEntry: async (id: string): Promise<void> => {
    await api.delete(`/entries/${id}`);
  },
};
