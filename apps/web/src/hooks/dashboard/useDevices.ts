import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DevicesService } from '../../services/DevicesService';
import type { Device, UpdateDeviceDto } from '../../services/DevicesService';

export const useDevicesList = () => {
  return useQuery<Device[], Error>({
    queryKey: ['dashboard', 'devices'],
    queryFn: DevicesService.getDevices,
  });
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DevicesService.createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'devices'] });
    },
  });
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeviceDto }) =>
      DevicesService.updateDevice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'devices'] });
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DevicesService.deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'devices'] });
    },
  });
};
