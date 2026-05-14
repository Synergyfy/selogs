import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsService } from '../../services/SettingsService';
import type {
  OrgProfile,
  OrgBranding,
  OrgSystemSettings,
} from '../../services/SettingsService';

export const useOrgProfile = () => {
  return useQuery<OrgProfile, Error>({
    queryKey: ['dashboard', 'settings', 'profile'],
    queryFn: SettingsService.getProfile,
  });
};

export const useUpdateOrgProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SettingsService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'settings', 'profile'] });
    },
  });
};

export const useOrgBranding = () => {
  return useQuery<OrgBranding, Error>({
    queryKey: ['dashboard', 'settings', 'branding'],
    queryFn: SettingsService.getBranding,
  });
};

export const useUpdateOrgBranding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SettingsService.updateBranding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'settings', 'branding'] });
    },
  });
};

export const useOrgSystemSettings = () => {
  return useQuery<OrgSystemSettings, Error>({
    queryKey: ['dashboard', 'settings', 'system'],
    queryFn: SettingsService.getSystemSettings,
  });
};

export const useUpdateOrgSystemSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SettingsService.updateSystemSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'settings', 'system'] });
    },
  });
};
