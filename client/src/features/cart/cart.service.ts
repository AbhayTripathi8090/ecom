import { api } from "../../lib/api";
import { CART_ENDPOINTS } from "./cart.endpoints";
import type { CartItem, AddToCartInput, UpdateCartItemInput } from "./cart.types";

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    try {
      const res: any = await api.get(CART_ENDPOINTS.GET);
      const data = res.data || res;
      return data.cart?.items || data.items || [];
    } catch {
      return [];
    }
  },

  addToCart: async (input: AddToCartInput): Promise<CartItem[]> => {
    try {
      const res: any = await api.post(CART_ENDPOINTS.ADD_ITEM, input);
      const data = res.data || res;
      return data.cart?.items || data.items || [];
    } catch {
      return [];
    }
  },

  updateCartItem: async (productId: string, input: UpdateCartItemInput): Promise<CartItem[]> => {
    try {
      const res: any = await api.patch(CART_ENDPOINTS.UPDATE_ITEM(productId), input);
      const data = res.data || res;
      return data.cart?.items || data.items || [];
    } catch {
      return [];
    }
  },

  removeCartItem: async (productId: string): Promise<CartItem[]> => {
    try {
      const res: any = await api.delete(CART_ENDPOINTS.REMOVE_ITEM(productId));
      const data = res.data || res;
      return data.cart?.items || data.items || [];
    } catch {
      return [];
    }
  },

  clearCart: async (): Promise<void> => {
    try {
      await api.delete(CART_ENDPOINTS.CLEAR);
    } catch {
      // Ignore
    }
  },
};
