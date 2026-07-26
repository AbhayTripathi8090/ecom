import { api } from "../../lib/api";
import { AUTH_ENDPOINTS } from "./auth.endpoints";
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from "./auth.types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    return res.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, credentials);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post(AUTH_ENDPOINTS.LOGOUT);
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await api.get<User>(AUTH_ENDPOINTS.ME);
    return res.data;
  },
};
