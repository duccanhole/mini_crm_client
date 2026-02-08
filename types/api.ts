export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  status?: number;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
