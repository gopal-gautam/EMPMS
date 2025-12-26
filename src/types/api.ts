// src/types/api.ts

/** Standardized API error shape for client-side handling */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/** Simple API wrapper response */
export interface ApiResponse<T> {
  data: T;
}

/** Common paginated response */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}