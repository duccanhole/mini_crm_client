import apiClient from '@/lib/api-client';
import { ApiResponse, PaginatedResponse, SearchQueryParams, LeadDTO } from '@/types/api';
import { Lead } from '@/types/model';

const LeadsService = {
  getAll: async (params?: SearchQueryParams): Promise<ApiResponse<PaginatedResponse<Lead>>> => {
    const response = await apiClient.get('/leads', { params });
    return response.data;
  },

  create: async (values: LeadDTO): Promise<ApiResponse<Lead>> => {
    const response = await apiClient.post('/leads', values);
    return response.data;
  },

  update: async (id: string | number, values: LeadDTO): Promise<ApiResponse<Lead>> => {
    const response = await apiClient.put(`/leads/${id}`, values);
    return response.data;
  },

  getById: async (id: string | number): Promise<ApiResponse<Lead>> => {
    const response = await apiClient.get(`/leads/${id}`);
    return response.data;
  },

  delete: async (id: string | number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/leads/${id}`);
    return response.data;
  }
};

export default LeadsService;
