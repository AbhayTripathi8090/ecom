import type { Product } from "../product/product.types";

export interface CartCustomization {
  size?: string;
  color?: string;
  printType?: string;
  printLocation?: string;
  artworkUrl?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customization?: CartCustomization;
  price: number;
  itemTotal: number;
}

export interface AddToCartInput {
  productId: string;
  quantity: number;
  customization?: CartCustomization;
}

export interface UpdateCartItemInput {
  quantity: number;
  customization?: CartCustomization;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface CartState {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;
}
