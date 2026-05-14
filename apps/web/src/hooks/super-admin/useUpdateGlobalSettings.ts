import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SuperAdminService } from '../../services/SuperAdminService';
import type { UpdateGlobalSettingsDto } from '../../types/super-admin';

export const useUpdateGlobalSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGlobalSettingsDto) => SuperAdminService.updateGlobalSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'global-settings'] });
    },
  });
};
