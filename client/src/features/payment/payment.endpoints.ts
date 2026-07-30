export const PAYMENT_ENDPOINTS = {
  ALL: "/payments",
  BY_ORDER: (orderId: string) => `/payments/order/${orderId}`,
  BY_ID: (id: string) => `/payments/${id}`,
  UPDATE_STATUS: (id: string) => `/payments/${id}/status`,
  CREATE_RAZORPAY_ORDER: "/payments/razorpay/create-order",
  VERIFY_RAZORPAY_PAYMENT: "/payments/razorpay/verify",
} as const;
