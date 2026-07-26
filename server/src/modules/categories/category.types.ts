import type { Types } from "mongoose";

export interface CategoryImage {
  url: string;
  publicId: string;
}

export interface CategoryDocument {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: CategoryImage;
  parentCategory?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
