export const PRODUCT_ENDPOINTS = {
  LIST: "/products",
  DETAIL: (id: string) => `/products/${id}`,
} as const;
