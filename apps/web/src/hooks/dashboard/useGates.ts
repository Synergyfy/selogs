import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GatesService } from '../../services/GatesService';
import type { Gate, UpdateGateDto } from '../../services/GatesService';

export const useGatesList = () => {
  return useQuery<Gate[], Error>({
    queryKey: ['dashboard', 'gates'],
    queryFn: GatesService.getGates,
  });
};

export const useCreateGate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GatesService.createGate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'gates'] });
    },
  });
};

export const useUpdateGate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGateDto }) =>
      GatesService.updateGate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'gates'] });
    },
  });
};

export const useDeleteGate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GatesService.deleteGate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'gates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    },
  });
};
