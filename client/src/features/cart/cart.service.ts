import { api } from "../../lib/api";
import { normalizeMongo } from "../../lib/normalize";
import { CART_ENDPOINTS } from "./cart.endpoints";
import type { CartItem, AddToCartInput, UpdateCartItemInput } from "./cart.types";

const normalizeCartItems = (items: any[]): CartItem[] =>
  normalizeMongo<any[]>(items).map((item) => ({
    ...item,
    id: item.id || item._id || item.product?.id || item.product?._id,
    product: normalizeMongo(item.product),
    itemTotal: item.itemTotal || item.price * item.quantity,
  }));

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    const res: any = await api.get(CART_ENDPOINTS.GET);
    const data = res.data || res;
    return normalizeCartItems(data.cart?.items || data.items || []);
  },

  addToCart: async (input: AddToCartInput): Promise<CartItem[]> => {
    const res: any = await api.post(CART_ENDPOINTS.ADD_ITEM, input);
    const data = res.data || res;
    return normalizeCartItems(data.cart?.items || data.items || []);
  },

  updateCartItem: async (productId: string, input: UpdateCartItemInput): Promise<CartItem[]> => {
    const res: any = await api.patch(CART_ENDPOINTS.UPDATE_ITEM(productId), input);
    const data = res.data || res;
    return normalizeCartItems(data.cart?.items || data.items || []);
  },

  removeCartItem: async (productId: string): Promise<CartItem[]> => {
    const res: any = await api.delete(CART_ENDPOINTS.REMOVE_ITEM(productId));
    const data = res.data || res;
    return normalizeCartItems(data.cart?.items || data.items || []);
  },

  clearCart: async (): Promise<void> => {
    await api.delete(CART_ENDPOINTS.CLEAR);
  },
};
