import { apiClient } from './apiClient';
import { ApiResponse, Notification } from '@/src/types';

export const notificationApi = {
  getNotifications: async (page = 1, limit = 20): Promise<Notification[]> => {
    const response = await apiClient.get<ApiResponse<any>>(`/notifications`, {
      params: { page, limit },
    });
    const data = response.data?.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.notifications)) {
      return data.notifications;
    }
    return [];
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put(`/notifications/read-all`);
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },
};
