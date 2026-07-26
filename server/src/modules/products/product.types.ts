import type { Types } from "mongoose";

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface SeoFields {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface ProductRatings {
  average: number;
  count: number;
}

export interface ProductDocument {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  category: Types.ObjectId;
  brand?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  images: ProductImage[];
  ratings: ProductRatings;
  isFeatured: boolean;
  isActive: boolean;
  seo?: SeoFields;
  createdAt: Date;
  updatedAt: Date;
}
