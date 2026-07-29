import { api } from "../../lib/api";
import { normalizeMongo } from "../../lib/normalize";
import { CATEGORY_ENDPOINTS } from "./category.endpoints";
import type { Category, CategoryQueryInput } from "./category.types";

export const categoryService = {
  getCategories: async (params?: CategoryQueryInput): Promise<Category[]> => {
    const res: any = await api.get(CATEGORY_ENDPOINTS.LIST, params);
    const data = res.data || res;
    return normalizeMongo<Category[]>(data.categories || data.items || data);
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const res: any = await api.get(CATEGORY_ENDPOINTS.DETAIL(id));
    const data = res.data || res;
    return normalizeMongo<Category>(data.category || data);
  },

  createCategory: async (input: FormData): Promise<Category> => {
    const res: any = await api.post(CATEGORY_ENDPOINTS.CREATE, input);
    const data = res.data || res;
    return normalizeMongo<Category>(data.category || data);
  },

  updateCategory: async (id: string, input: FormData): Promise<Category> => {
    const res: any = await api.patch(CATEGORY_ENDPOINTS.UPDATE(id), input);
    const data = res.data || res;
    return normalizeMongo<Category>(data.category || data);
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(CATEGORY_ENDPOINTS.DELETE(id));
  },
};
