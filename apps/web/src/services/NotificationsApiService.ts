import api from './api';

export interface ServerNotification {
  id: string;
  organizationId: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  read: boolean;
  createdAt: string;
}

export const NotificationsApiService = {
  getAll: async (
    limit?: number,
    offset?: number,
  ): Promise<{ data: ServerNotification[]; total: number }> => {
    const response = await api.get('/notifications', {
      params: { limit, offset },
    });
    return response.data;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },

  broadcast: async (data: {
    title: string;
    message: string;
    type?: string;
    priority?: string;
    target: 'all' | string[];
  }): Promise<{ count: number }> => {
    const response = await api.post('/notifications/broadcast', data);
    return response.data;
  },

  getAllBroadcasts: async (
    limit?: number,
    offset?: number,
  ): Promise<{ data: ServerNotification[]; total: number }> => {
    const response = await api.get('/notifications/all', {
      params: { limit, offset },
    });
    return response.data;
  },
};
