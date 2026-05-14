import api from './api';

export interface OrgProfile {
  name: string;
  location?: string;
  systemName?: string;
  logoUrl?: string;
}

export interface OrgBranding {
  primaryColor?: string;
  logoUrl?: string;
}

export interface OrgSystemSettings {
  requirePhone?: boolean;
  enableNotes?: boolean;
  ocrOptimization?: boolean;
  mode?: 'hotel' | 'estate' | 'security';
}

export const SettingsService = {
  getProfile: async (): Promise<OrgProfile> => {
    const response = await api.get('/settings/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<OrgProfile>): Promise<OrgProfile> => {
    const response = await api.patch('/settings/profile', data);
    return response.data;
  },

  getBranding: async (): Promise<OrgBranding> => {
    const response = await api.get('/settings/branding');
    return response.data;
  },

  updateBranding: async (data: OrgBranding): Promise<OrgBranding> => {
    const response = await api.patch('/settings/branding', data);
    return response.data;
  },

  getSystemSettings: async (): Promise<OrgSystemSettings> => {
    const response = await api.get('/settings/system');
    return response.data;
  },

  updateSystemSettings: async (data: OrgSystemSettings): Promise<OrgSystemSettings> => {
    const response = await api.patch('/settings/system', data);
    return response.data;
  },
};
