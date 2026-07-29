export const PRODUCT_ENDPOINTS = {
  LIST: "/products",
  DETAIL: (id: string) => `/products/${id}`,
  CREATE: "/products",
  UPDATE: (id: string) => `/products/${id}`,
  DELETE: (id: string) => `/products/${id}`,
} as const;
