import apiClient from '@/lib/api-client';
import { ApiResponse, PaginatedResponse, SearchQueryParams, CustomerDTO } from '@/types/api';
import { Customer } from '@/types/model';

const CustomersService = {
  getAll: async (params?: SearchQueryParams): Promise<ApiResponse<PaginatedResponse<Customer>>> => {
    const response = await apiClient.get('/customers', { params });
    return response.data;
  },

  create: async (values: CustomerDTO): Promise<ApiResponse<Customer>> => {
    const response = await apiClient.post('/customers', values);
    return response.data;
  },

  update: async (id: string | number, values: CustomerDTO): Promise<ApiResponse<Customer>> => {
    const response = await apiClient.put(`/customers/${id}`, values);
    return response.data;
  },

  getById: async (id: string | number): Promise<ApiResponse<Customer>> => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  },

  delete: async (id: string | number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  }
};

export default CustomersService;
