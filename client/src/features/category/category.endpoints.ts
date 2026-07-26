export const CATEGORY_ENDPOINTS = {
  LIST: "/categories",
  DETAIL: (id: string) => `/categories/${id}`,
} as const;
