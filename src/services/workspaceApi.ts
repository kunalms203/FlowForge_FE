import { apiClient } from './apiClient';
import { ApiResponse, Workspace } from '@/src/types';

export const workspaceApi = {
  getWorkspaces: async (): Promise<Workspace[]> => {
    const response = await apiClient.get<ApiResponse<Workspace[]>>('/workspaces');
    return response.data.data;
  },

  getWorkspaceById: async (workspaceId: string): Promise<Workspace> => {
    const response = await apiClient.get<ApiResponse<Workspace>>(`/workspaces/${workspaceId}`);
    return response.data.data;
  },

  createWorkspace: async (data: { name: string }): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>('/workspaces', data);
    return response.data.data;
  },

  updateWorkspace: async (workspaceId: string, data: { name: string }): Promise<Workspace> => {
    const response = await apiClient.put<ApiResponse<Workspace>>(`/workspaces/${workspaceId}`, data);
    return response.data.data;
  },

  deleteWorkspace: async (workspaceId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}`);
  },
};
