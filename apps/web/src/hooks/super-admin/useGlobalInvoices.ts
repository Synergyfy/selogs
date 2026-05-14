import { useQuery } from '@tanstack/react-query';
import { SuperAdminService } from '../../services/SuperAdminService';
import type { GlobalInvoice } from '../../types/super-admin';

export const useGlobalInvoices = (page: number = 1, limit: number = 20) => {
  return useQuery<{ items: GlobalInvoice[]; total: number }, Error>({
    queryKey: ['super-admin', 'global-invoices', page, limit],
    queryFn: () => SuperAdminService.getGlobalInvoices(page, limit),
    staleTime: 1000 * 60 * 5,
  });
};
