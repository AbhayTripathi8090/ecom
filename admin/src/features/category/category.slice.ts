import { createSlice } from "@reduxjs/toolkit";
import type { CategoryState } from "./category.types";
import { fetchCategoriesThunk, fetchCategoryByIdThunk } from "./category.thunk";

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder.addCase(fetchCategoriesThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategoriesThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load categories";
    });

    // Fetch Category By Id
    builder.addCase(fetchCategoryByIdThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCategoryByIdThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedCategory = action.payload;
    });
    builder.addCase(fetchCategoryByIdThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load category details";
    });
  },
});

export const { clearCategoryError, setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
