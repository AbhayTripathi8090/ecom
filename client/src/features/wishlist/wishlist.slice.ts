import { createSlice } from "@reduxjs/toolkit";
import type { WishlistState } from "./wishlist.types";
import {
  addToWishlistThunk,
  clearWishlistThunk,
  fetchWishlistThunk,
  removeFromWishlistThunk,
} from "./wishlist.thunk";

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistState: (state) => {
      state.items = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchWishlistThunk
      .addCase(fetchWishlistThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // addToWishlistThunk
      .addCase(addToWishlistThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWishlistThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToWishlistThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // removeFromWishlistThunk
      .addCase(removeFromWishlistThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlistThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // clearWishlistThunk
      .addCase(clearWishlistThunk.fulfilled, (state) => {
        state.items = [];
        state.error = null;
      });
  },
});

export const { resetWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
