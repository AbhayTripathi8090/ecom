export const WISHLIST_ENDPOINTS = {
  GET: "/wishlist",
  ADD_ITEM: "/wishlist/products",
  REMOVE_ITEM: (productId: string) => `/wishlist/products/${productId}`,
  CLEAR: "/wishlist",
};
