export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const ROUTE_PATHS = {
  HOME: "/dashboard",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  CATEGORIES: "/categories",
  ORDERS: "/orders",
  CUSTOMERS: "/customers",
  PAYMENTS: "/payments",
  SHIPPING: "/shipping",
  ANALYTICS: "/analytics",
  NOT_FOUND: "*",
} as const;

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
  REFRESH: "/auth/refresh",
} as const;
