import type { RootState } from "../../store";

export const selectCategories = (state: RootState) => state.category.categories;
export const selectSelectedCategory = (state: RootState) => state.category.selectedCategory;
export const selectCategoryLoading = (state: RootState) => state.category.isLoading;
export const selectCategoryError = (state: RootState) => state.category.error;
