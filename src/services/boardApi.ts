import { apiClient } from './apiClient';
import { ApiResponse, Board } from '@/src/types';

export interface CreateBoardPayload {
  name: string;
}

export interface UpdateBoardPayload {
  name?: string;
  position?: number;
}

export const boardApi = {
  getBoards: async (workspaceId: string, projectId: string): Promise<Board[]> => {
    const response = await apiClient.get<ApiResponse<Board[]>>(
      `/workspaces/${workspaceId}/projects/${projectId}/boards`
    );
    return response.data.data;
  },

  getBoardById: async (workspaceId: string, projectId: string, boardId: string): Promise<Board> => {
    const response = await apiClient.get<ApiResponse<Board>>(
      `/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}`
    );
    return response.data.data;
  },

  createBoard: async (workspaceId: string, projectId: string, payload: CreateBoardPayload): Promise<Board> => {
    const response = await apiClient.post<ApiResponse<Board>>(
      `/workspaces/${workspaceId}/projects/${projectId}/boards`,
      payload
    );
    return response.data.data;
  },

  updateBoard: async (
    workspaceId: string,
    projectId: string,
    boardId: string,
    payload: UpdateBoardPayload
  ): Promise<Board> => {
    const response = await apiClient.put<ApiResponse<Board>>(
      `/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}`,
      payload
    );
    return response.data.data;
  },

  deleteBoard: async (workspaceId: string, projectId: string, boardId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}`);
  },
};
