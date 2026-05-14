import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EntriesService } from '../../services/EntriesService';
import type { EntriesParams, PaginatedEntries } from '../../services/EntriesService';

export const useEntriesList = (params?: EntriesParams) => {
  return useQuery<PaginatedEntries, Error>({
    queryKey: ['dashboard', 'entries', params],
    queryFn: () => EntriesService.getEntries(params),
  });
};

export const useDeleteEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: EntriesService.deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    },
  });
};
