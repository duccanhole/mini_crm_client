import apiClient from '@/lib/api-client';
import { ApiResponse, PaginatedResponse, SearchQueryParams, UserDTO } from '@/types/api';
import { User } from '@/types/model';

const UsersService = {
  create: async (values: UserDTO): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await apiClient.post('/users', values);
    return response.data;
  },

  update: async (id: string, values: UserDTO): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/users/${id}`, values);
    return response.data;
  },

  getAll: async (params?: SearchQueryParams): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // Note: Differentiating between 'update' (users) and 'updateUser' (user) as requested
  updateUser: async (id: string, values: any): Promise<ApiResponse<null>> => {
    const response = await apiClient.put(`/users/${id}`, values);
    return response.data;
  },

  changePassword: async (id: string, values: any): Promise<ApiResponse<null>> => {
    const response = await apiClient.put(`/users/${id}/change-password`, values);
    return response.data;
  },

  resetPassword: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put(`/users/${id}/reset-password`);
    return response.data;
  }
};

export default UsersService;
