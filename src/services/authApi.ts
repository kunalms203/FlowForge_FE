import { apiClient } from './apiClient';
import { ApiResponse, AuthData, User } from '@/src/types';

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  workspaceName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthData>> => {
    const response = await apiClient.post<ApiResponse<AuthData>>('/auth/register', payload);
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<ApiResponse<AuthData>> => {
    const response = await apiClient.post<ApiResponse<AuthData>>('/auth/login', payload);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (refreshToken: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/logout', { refreshToken });
    return response.data;
  },
};
