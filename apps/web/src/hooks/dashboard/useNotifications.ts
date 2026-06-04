import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationsApiService } from '../../services/NotificationsApiService';

export const useNotificationsList = (page: number = 1, pageSize: number = 20) => {
  return useQuery({
    queryKey: ['dashboard', 'notifications', page, pageSize],
    queryFn: () => NotificationsApiService.getAll(pageSize, (page - 1) * pageSize),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['dashboard', 'notifications', 'unread-count'],
    queryFn: NotificationsApiService.getUnreadCount,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: NotificationsApiService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'notifications'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: NotificationsApiService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'notifications'] });
    },
  });
};

export const useSendBroadcast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: NotificationsApiService.broadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'notifications'] });
    },
  });
};

export const useBroadcastsList = (page: number = 1, pageSize: number = 20) => {
  return useQuery({
    queryKey: ['super-admin', 'notifications', 'broadcasts', page, pageSize],
    queryFn: () => NotificationsApiService.getAllBroadcasts(pageSize, (page - 1) * pageSize),
  });
};
