import { api } from "../../lib/api";
import { normalizeMongo } from "../../lib/normalize";
import type { Product } from "../product/product.types";
import { WISHLIST_ENDPOINTS } from "./wishlist.endpoints";

const normalizeWishlistProducts = (products: any[]): Product[] =>
  normalizeMongo<any[]>(products).map((product) => normalizeMongo(product));

export const wishlistService = {
  getWishlist: async (): Promise<Product[]> => {
    const res: any = await api.get(WISHLIST_ENDPOINTS.GET);
    const data = res.data || res;
    const wishlist = data.wishlist || data;
    return normalizeWishlistProducts(wishlist.products || []);
  },

  addToWishlist: async (productId: string): Promise<Product[]> => {
    const res: any = await api.post(WISHLIST_ENDPOINTS.ADD_ITEM, { productId });
    const data = res.data || res;
    const wishlist = data.wishlist || data;
    return normalizeWishlistProducts(wishlist.products || []);
  },

  removeFromWishlist: async (productId: string): Promise<Product[]> => {
    const res: any = await api.delete(WISHLIST_ENDPOINTS.REMOVE_ITEM(productId));
    const data = res.data || res;
    const wishlist = data.wishlist || data;
    return normalizeWishlistProducts(wishlist.products || []);
  },

  clearWishlist: async (): Promise<void> => {
    await api.delete(WISHLIST_ENDPOINTS.CLEAR);
  },
};
