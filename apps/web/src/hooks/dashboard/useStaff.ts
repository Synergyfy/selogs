import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaffService } from '../../services/StaffService';
import type { StaffMember, UpdateStaffDto } from '../../types/dashboard';

export const useStaffList = () => {
  return useQuery<StaffMember[], Error>({
    queryKey: ['dashboard', 'staff'],
    queryFn: StaffService.getStaff,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: StaffService.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'staff'] });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffDto }) =>
      StaffService.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'staff'] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: StaffService.deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'staff'] });
    },
  });
};
