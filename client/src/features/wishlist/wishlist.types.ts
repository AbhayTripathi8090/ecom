import type { Product } from "../product/product.types";

export interface WishlistState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
}

export interface AddToWishlistInput {
  productId: string;
}
