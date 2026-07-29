export const ORDER_ENDPOINTS = {
  CREATE: "/orders",
  MY_ORDERS: "/orders/my",
  ALL_ORDERS: "/orders",
  DETAIL: (id: string) => `/orders/${id}`,
  UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  CANCEL: (id: string) => `/orders/${id}/cancel`,
} as const;
