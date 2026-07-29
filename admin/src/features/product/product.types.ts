import type { Category } from "../category/category.types";

export interface ProductImage {
  url: string;
  publicId: string;
}

export type MerchandiseSize = "S" | "M" | "L" | "XL" | "XXL";
export type PrintType = "DTF Printing" | "Screen Printing" | "Sublimation" | "Embroidery" | "UV Printing";
export type PrintLocation = "Front" | "Back" | "Left Chest" | "Right Sleeve";

export interface ProductCustomizationOptions {
  size: MerchandiseSize;
  color: string;
  printType: PrintType;
  printLocation: PrintLocation;
  quantity: number;
  artworkFile?: File | null;
  artworkUrl?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string | Category;
  brand?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  images: ProductImage[];
  ratings?: {
    average: number;
    count: number;
  };
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryInput {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductState {
  items: Product[];
  featuredItems: Product[];
  selectedProduct: Product | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: ProductQueryInput;
  isLoading: boolean;
  error: string | null;
}
