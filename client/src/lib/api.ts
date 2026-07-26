import { axiosInstance } from "./axios";
import type { ApiResponse } from "../types/api";

export const api = {
  get: async <T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.get<ApiResponse<T>>(url, { params });
    return response.data;
  },
  post: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data);
    return response.data;
  },
  put: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data);
    return response.data;
  },
  patch: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data);
    return response.data;
  },
  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.delete<ApiResponse<T>>(url);
    return response.data;
  },
};
