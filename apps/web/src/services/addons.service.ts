import api from './api';

export interface Addon {
  id: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  icon: string;
  color: string;
  isActive: boolean;
  unitsSold: number;
  revenue: number;
  branchLimitInc: number;
  staffLimitInc: number;
  deviceLimitInc: number;
  customFeatures: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddonDto {
  name: string;
  description?: string;
  monthlyPrice: number;
  icon?: string;
  color?: string;
  isActive?: boolean;
  branchLimitInc?: number;
  staffLimitInc?: number;
  deviceLimitInc?: number;
  customFeatures?: string[];
}

export type UpdateAddonDto = Partial<CreateAddonDto>;

export const addonsService = {
  async getAllAddons(): Promise<Addon[]> {
    const response = await api.get<Addon[]>('/addons/all');
    return response.data;
  },

  async getActiveAddons(): Promise<Addon[]> {
    const response = await api.get<Addon[]>('/addons');
    return response.data;
  },

  async createAddon(data: CreateAddonDto): Promise<Addon> {
    const response = await api.post<Addon>('/addons', data);
    return response.data;
  },

  async updateAddon(id: string, data: UpdateAddonDto): Promise<Addon> {
    const response = await api.patch<Addon>(`/addons/${id}`, data);
    return response.data;
  },

  async deleteAddon(id: string): Promise<void> {
    await api.delete(`/addons/${id}`);
  },
};
