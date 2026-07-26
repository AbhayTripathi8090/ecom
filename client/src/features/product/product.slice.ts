import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProductState, ProductQueryInput } from "./product.types";
import { fetchProductsThunk, fetchProductByIdThunk } from "./product.thunk";

const initialState: ProductState = {
  items: [],
  featuredItems: [],
  selectedProduct: null,
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 1,
  filters: {
    search: "",
    category: "",
    sort: "-createdAt",
    page: 1,
    limit: 12,
  },
  isLoading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductQueryInput>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProductsThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProductsThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload.products;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
      state.featuredItems = action.payload.products.filter((p) => p.isFeatured);
    });
    builder.addCase(fetchProductsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load products";
    });

    // Fetch Product By Id
    builder.addCase(fetchProductByIdThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedProduct = action.payload;
    });
    builder.addCase(fetchProductByIdThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load product details";
    });
  },
});

export const { clearProductError, setFilters, resetFilters } = productSlice.actions;
export default productSlice.reducer;
