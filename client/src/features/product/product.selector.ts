import type { RootState } from "../../store";

export const selectProducts = (state: RootState) => state.product.items;
export const selectFeaturedProducts = (state: RootState) => state.product.featuredItems;
export const selectSelectedProduct = (state: RootState) => state.product.selectedProduct;
export const selectProductFilters = (state: RootState) => state.product.filters;
export const selectProductPagination = (state: RootState) => ({
  page: state.product.page,
  limit: state.product.limit,
  total: state.product.total,
  totalPages: state.product.totalPages,
});
export const selectProductLoading = (state: RootState) => state.product.isLoading;
export const selectProductError = (state: RootState) => state.product.error;
