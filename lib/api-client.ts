import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

import Cookies from 'js-cookie';

// Request interceptor: Thêm token vào header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Xử lý lỗi tập trung
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Ví dụ: Tự động redirect về login nếu 401
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login?reason=unauthorized';
      }
    }

    // Format lại message lỗi từ server nếu có
    const message = (error.response?.data as any)?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
