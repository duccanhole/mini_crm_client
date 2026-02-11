import apiClient from '@/lib/api-client';
import { ApiResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/api';

const AuthService = {
  login: async (values: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post('/auth/login', values);
    return response.data;
  },

  register: async (values: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    const response = await apiClient.post('/auth/register', values);
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  setDefaultAccount: async () => {
    const response = await apiClient.post('/auth/default-account');
    return response.data;
  }
};

export default AuthService;
