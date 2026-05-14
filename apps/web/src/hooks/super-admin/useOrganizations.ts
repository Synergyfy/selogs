import { useQuery } from '@tanstack/react-query';
import { SuperAdminService } from '../../services/SuperAdminService';
import type { Organization } from '../../types/super-admin';

export const useOrganizations = () => {
  return useQuery<Organization[], Error>({
    queryKey: ['super-admin', 'organizations'],
    queryFn: SuperAdminService.getOrganizations,
    staleTime: 1000 * 60 * 5,
  });
};
