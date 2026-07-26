export const CART_ENDPOINTS = {
  GET: "/cart",
  ADD_ITEM: "/cart/items",
  UPDATE_ITEM: (productId: string) => `/cart/items/${productId}`,
  REMOVE_ITEM: (productId: string) => `/cart/items/${productId}`,
  CLEAR: "/cart",
} as const;
