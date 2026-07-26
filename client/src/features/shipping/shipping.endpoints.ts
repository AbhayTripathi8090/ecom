export const SHIPPING_ENDPOINTS = {
  ADDRESSES: "/shipping/addresses",
  ADDRESS_BY_ID: (id: string) => `/shipping/addresses/${id}`,
  UPDATE_ORDER_SHIPPING: (orderId: string) => `/shipping/orders/${orderId}/status`,
} as const;
