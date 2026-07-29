export const CATEGORY_ENDPOINTS = {
  LIST: "/categories",
  DETAIL: (id: string) => `/categories/${id}`,
  CREATE: "/categories",
  UPDATE: (id: string) => `/categories/${id}`,
  DELETE: (id: string) => `/categories/${id}`,
} as const;
