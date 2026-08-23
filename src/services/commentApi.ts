import { apiClient } from './apiClient';
import { ApiResponse, Comment } from '@/src/types';

export const commentApi = {
  getComments: async (taskId: string): Promise<Comment[]> => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`);
    return response.data.data;
  },

  createComment: async (taskId: string, content: string): Promise<Comment> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, { content });
    return response.data.data;
  },

  updateComment: async (taskId: string, commentId: string, content: string): Promise<Comment> => {
    const response = await apiClient.put<ApiResponse<Comment>>(`/tasks/${taskId}/comments/${commentId}`, { content });
    return response.data.data;
  },

  deleteComment: async (taskId: string, commentId: string): Promise<void> => {
    await apiClient.delete(`/tasks/${taskId}/comments/${commentId}`);
  },
};
