import { apiClient } from './apiClient';
import { ActivityLog, ApiResponse } from '@/src/types';

export const activityApi = {
  getWorkspaceActivities: async (workspaceId: string, page = 1, limit = 30): Promise<ActivityLog[]> => {
    const response = await apiClient.get<ApiResponse<any>>(`/activities/workspace/${workspaceId}`, {
      params: { page, limit },
    });
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.activities)) return data.activities;
    return [];
  },

  getProjectActivities: async (projectId: string, page = 1, limit = 30): Promise<ActivityLog[]> => {
    const response = await apiClient.get<ApiResponse<any>>(`/activities/project/${projectId}`, {
      params: { page, limit },
    });
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.activities)) return data.activities;
    return [];
  },

  getTaskActivities: async (taskId: string, page = 1, limit = 30): Promise<ActivityLog[]> => {
    const response = await apiClient.get<ApiResponse<any>>(`/activities/task/${taskId}`, {
      params: { page, limit },
    });
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.activities)) return data.activities;
    return [];
  },
};
