import { apiClient } from './apiClient';
import { ApiResponse, Task, TaskPriority, TaskStatus } from '@/src/types';

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  storyPoints?: number;
  startDate?: string;
  dueDate?: string;
  assigneeId?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  storyPoints?: number;
  startDate?: string;
  dueDate?: string;
  assigneeId?: string | null;
}

export const taskApi = {
  getTasks: async (workspaceId: string, projectId: string, boardId: string): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks`
    );
    return response.data.data;
  },

  getTaskById: async (
    workspaceId: string,
    projectId: string,
    boardId: string,
    taskId: string
  ): Promise<Task> => {
    const response = await apiClient.get<ApiResponse<Task>>(
      `/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}`
    );
    return response.data.data;
  },

  createTask: async (
    workspaceId: string,
    projectId: string,
    boardId: string,
    payload: CreateTaskPayload
  ): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>(
      `/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks`,
      payload
    );
    return response.data.data;
  },

  updateTask: async (
    workspaceId: string,
    projectId: string,
    boardId: string,
    taskId: string,
    payload: UpdateTaskPayload
  ): Promise<Task> => {
    const response = await apiClient.put<ApiResponse<Task>>(
      `/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}`,
      payload
    );
    return response.data.data;
  },

  moveTask: async (
    workspaceId: string,
    projectId: string,
    boardId: string,
    taskId: string,
    newBoardId: string
  ): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>(
      `/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/move`,
      { newBoardId }
    );
    return response.data.data;
  },

  deleteTask: async (
    workspaceId: string,
    projectId: string,
    boardId: string,
    taskId: string
  ): Promise<void> => {
    await apiClient.delete(
      `/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}`
    );
  },
};
