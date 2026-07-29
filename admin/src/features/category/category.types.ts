export interface CategoryImage {
  url: string;
  publicId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: CategoryImage;
  parentCategory?: string | Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryQueryInput {
  search?: string;
  parentCategory?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}
