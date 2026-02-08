import apiClient from '@/lib/api-client';
import { ApiResponse, LoginResponse, RegisterResponse } from '@/types/api';

const AuthService = {
  login: async (values: any): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post('/auth/login', values);
    return response.data;
  },

  register: async (values: any): Promise<ApiResponse<RegisterResponse>> => {
    const response = await apiClient.post('/auth/register', values);
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

export default AuthService;
