import { createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "./product.service";
import { getErrorMessage } from "../../utils/helpers";
import type { Product, ProductQueryInput, ProductListResponse } from "./product.types";

export const fetchProductsThunk = createAsyncThunk<
  ProductListResponse,
  ProductQueryInput | undefined,
  { rejectValue: string }
>("product/fetchProducts", async (params, { rejectWithValue }) => {
  try {
    return await productService.getProducts(params);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchProductByIdThunk = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("product/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    return await productService.getProductById(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
