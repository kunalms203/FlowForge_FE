import { apiClient } from './apiClient';
import { ApiResponse, Project } from '@/src/types';

export interface CreateProjectPayload {
  name: string;
  description?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
}

export const projectApi = {
  getProjects: async (workspaceId: string): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>(`/workspaces/${workspaceId}/projects`);
    return response.data.data;
  },

  getProjectById: async (workspaceId: string, projectId: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`/workspaces/${workspaceId}/projects/${projectId}`);
    return response.data.data;
  },

  createProject: async (workspaceId: string, payload: CreateProjectPayload): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(`/workspaces/${workspaceId}/projects`, payload);
    return response.data.data;
  },

  updateProject: async (workspaceId: string, projectId: string, payload: UpdateProjectPayload): Promise<Project> => {
    const response = await apiClient.put<ApiResponse<Project>>(`/workspaces/${workspaceId}/projects/${projectId}`, payload);
    return response.data.data;
  },

  deleteProject: async (workspaceId: string, projectId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
  },
};
