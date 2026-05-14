import { useQuery } from '@tanstack/react-query';
import { SuperAdminService } from '../../services/SuperAdminService';
import type { GlobalSettings } from '../../types/super-admin';

export const useGlobalSettings = () => {
  return useQuery<GlobalSettings, Error>({
    queryKey: ['super-admin', 'global-settings'],
    queryFn: SuperAdminService.getGlobalSettings,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
