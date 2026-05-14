import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BranchesService } from '../../services/BranchesService';
import type { Branch, UpdateBranchDto } from '../../services/BranchesService';

export const useBranchesList = () => {
  return useQuery<Branch[], Error>({
    queryKey: ['dashboard', 'branches'],
    queryFn: BranchesService.getBranches,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BranchesService.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'branches'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBranchDto }) =>
      BranchesService.updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'branches'] });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BranchesService.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'branches'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
    },
  });
};
