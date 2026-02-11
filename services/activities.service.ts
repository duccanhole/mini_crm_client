import apiClient from '@/lib/api-client';
import { ApiResponse, PaginatedResponse, SearchQueryParams, ActivityDTO } from '@/types/api';
import { Activity } from '@/types/model';

const ActivitiesService = {
  getAll: async (params?: SearchQueryParams): Promise<ApiResponse<PaginatedResponse<Activity>>> => {
    const response = await apiClient.get('/activities', { params });
    return response.data;
  },

  create: async (values: ActivityDTO): Promise<ApiResponse<Activity>> => {
    const response = await apiClient.post('/activities', values);
    return response.data;
  },

  update: async (id: string | number, values: ActivityDTO): Promise<ApiResponse<Activity>> => {
    const response = await apiClient.put(`/activities/${id}`, values);
    return response.data;
  },

  getById: async (id: string | number): Promise<ApiResponse<Activity>> => {
    const response = await apiClient.get(`/activities/${id}`);
    return response.data;
  },

  delete: async (id: string | number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/activities/${id}`);
    return response.data;
  }
};

export default ActivitiesService;
