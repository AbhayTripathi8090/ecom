import { createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService } from "./wishlist.service";

export const fetchWishlistThunk = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      return await wishlistService.getWishlist();
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

export const addToWishlistThunk = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId: string, { rejectWithValue }) => {
    try {
      return await wishlistService.addToWishlist(productId);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to add product to wishlist",
      );
    }
  },
);

export const removeFromWishlistThunk = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId: string, { rejectWithValue }) => {
    try {
      return await wishlistService.removeFromWishlist(productId);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to remove product from wishlist",
      );
    }
  },
);

export const clearWishlistThunk = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue }) => {
    try {
      await wishlistService.clearWishlist();
      return [];
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to clear wishlist",
      );
    }
  },
);
