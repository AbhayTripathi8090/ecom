import { api } from "../../lib/api";
import { AUTH_ENDPOINTS } from "./auth.endpoints";
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from "./auth.types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res: any = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    const data = res.data || res;
    return {
      user: data.user,
      token: data.tokens?.accessToken || data.token,
      tokens: data.tokens,
    };
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    let payload: any = credentials;

    if (credentials.profileImage) {
      const formData = new FormData();
      formData.append("name", credentials.name);
      formData.append("email", credentials.email);
      formData.append("password", credentials.password);
      formData.append("profileImage", credentials.profileImage);
      payload = formData;
    }

    const res: any = await api.post(AUTH_ENDPOINTS.REGISTER, payload);
    const data = res.data || res;
    return {
      user: data.user,
      token: data.tokens?.accessToken || data.token,
      tokens: data.tokens,
    };
  },

  logout: async (): Promise<void> => {
    await api.post(AUTH_ENDPOINTS.LOGOUT);
  },

  getCurrentUser: async (): Promise<User> => {
    const res: any = await api.get(AUTH_ENDPOINTS.ME);
    const data = res.data || res;
    return data.user || data;
  },

  uploadProfileImage: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("profileImage", file);
    const res: any = await api.patch("/auth/profile-image", formData);
    const data = res.data || res;
    return data.user || data;
  },
};
