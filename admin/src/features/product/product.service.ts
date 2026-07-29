import { api } from "../../lib/api";
import { normalizeMongo } from "../../lib/normalize";
import { PRODUCT_ENDPOINTS } from "./product.endpoints";
import type { Product, ProductQueryInput, ProductListResponse } from "./product.types";

export const productService = {
  getProducts: async (params?: ProductQueryInput): Promise<ProductListResponse> => {
    const res: any = await api.get(PRODUCT_ENDPOINTS.LIST, params);
    const data = res.data || res;
    if (Array.isArray(data.products)) {
      const products = normalizeMongo<Product[]>(data.products);
      const meta = data.meta || {};
      return {
        products,
        total: meta.total || data.total || products.length,
        page: meta.page || data.page || 1,
        limit: meta.limit || data.limit || 10,
        totalPages: meta.totalPages || data.totalPages || 1,
      };
    }
    if (Array.isArray(data)) {
      const products = normalizeMongo<Product[]>(data);
      return {
        products,
        total: products.length,
        page: 1,
        limit: products.length,
        totalPages: 1,
      };
    }
    const products = normalizeMongo<Product[]>(data.items || []);
    return {
      products,
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 10,
      totalPages: data.totalPages || 1,
    };
  },

  getProductById: async (id: string): Promise<Product> => {
    const res: any = await api.get(PRODUCT_ENDPOINTS.DETAIL(id));
    const data = res.data || res;
    return normalizeMongo<Product>(data.product || data);
  },

  createProduct: async (input: FormData): Promise<Product> => {
    const res: any = await api.post(PRODUCT_ENDPOINTS.CREATE, input);
    const data = res.data || res;
    return normalizeMongo<Product>(data.product || data);
  },

  updateProduct: async (id: string, input: FormData): Promise<Product> => {
    const res: any = await api.patch(PRODUCT_ENDPOINTS.UPDATE(id), input);
    const data = res.data || res;
    return normalizeMongo<Product>(data.product || data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(PRODUCT_ENDPOINTS.DELETE(id));
  },
};
