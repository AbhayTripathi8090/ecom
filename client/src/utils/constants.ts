export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ROUTE_PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  NOT_FOUND: "*",
} as const;

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
  REFRESH: "/auth/refresh",
} as const;

export const USER_ENDPOINTS = {
  PROFILE: "/users/profile",
  UPDATE_PROFILE: "/users/profile",
  CHANGE_PASSWORD: "/users/change-password",
} as const;
