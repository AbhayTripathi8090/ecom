import { api } from "../../lib/api";
import { CATEGORY_ENDPOINTS } from "./category.endpoints";
import type { Category, CategoryQueryInput } from "./category.types";

export const categoryService = {
  getCategories: async (params?: CategoryQueryInput): Promise<Category[]> => {
    const res: any = await api.get(CATEGORY_ENDPOINTS.LIST, params);
    const data = res.data || res;
    return data.categories || data.items || data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const res: any = await api.get(CATEGORY_ENDPOINTS.DETAIL(id));
    const data = res.data || res;
    return data.category || data;
  },
};
