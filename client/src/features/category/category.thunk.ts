import { createAsyncThunk } from "@reduxjs/toolkit";
import { categoryService } from "./category.service";
import { getErrorMessage } from "../../utils/helpers";
import type { Category, CategoryQueryInput } from "./category.types";

export const fetchCategoriesThunk = createAsyncThunk<
  Category[],
  CategoryQueryInput | undefined,
  { rejectValue: string }
>("category/fetchCategories", async (params, { rejectWithValue }) => {
  try {
    return await categoryService.getCategories(params);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchCategoryByIdThunk = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>("category/fetchCategoryById", async (id, { rejectWithValue }) => {
  try {
    return await categoryService.getCategoryById(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
