import { api } from "../../lib/api";
import { PRODUCT_ENDPOINTS } from "./product.endpoints";
import type { Product, ProductQueryInput, ProductListResponse } from "./product.types";

export const productService = {
  getProducts: async (params?: ProductQueryInput): Promise<ProductListResponse> => {
    const res: any = await api.get(PRODUCT_ENDPOINTS.LIST, params);
    const data = res.data || res;
    if (Array.isArray(data.products)) {
      return {
        products: data.products,
        total: data.total || data.products.length,
        page: data.page || 1,
        limit: data.limit || 10,
        totalPages: data.totalPages || 1,
      };
    }
    if (Array.isArray(data)) {
      return {
        products: data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      };
    }
    return {
      products: data.items || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 10,
      totalPages: data.totalPages || 1,
    };
  },

  getProductById: async (id: string): Promise<Product> => {
    const res: any = await api.get(PRODUCT_ENDPOINTS.DETAIL(id));
    const data = res.data || res;
    return data.product || data;
  },
};
