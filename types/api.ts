export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  status?: number;
}

export interface PaginatedResponse<T> {
  content: Array<T>;
  first: boolean;
  last: boolean;
  empty: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
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

export interface SearchQueryParams {
  [field: string]: string | number | boolean | undefined;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface UserDTO {
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  password?: string;
  status?: string;
}

export interface LeadDTO {
    customerId?: string | number;
    value?: number;
    status?: string;
    assignedToId?: string | number;
    expectedCloseDate?: string;
}

export interface CustomerDTO {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
    saleId?: string | number;
}

export interface ActivityDTO {
    leadId?: string | number;
    type?: string;
    description?: string;
}
