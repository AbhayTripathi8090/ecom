export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  statusCode?: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
