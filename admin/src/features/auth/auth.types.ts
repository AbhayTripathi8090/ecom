import type { UserRole } from "../../types/common";

export interface UserProfileImage {
  url: string;
  publicId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: UserProfileImage;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: "admin";
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  tokens?: AuthTokens;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function getUserAvatarUrl(user?: User | null): string | undefined {
  if (!user) return undefined;
  return user.profileImage?.url || user.avatar;
}
