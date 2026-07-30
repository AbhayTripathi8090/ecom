import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store/rootReducer";

export const selectWishlistState = (state: RootState) => state.wishlist;

export const selectWishlistItems = createSelector(
  [selectWishlistState],
  (wishlist) => wishlist?.items || [],
);

export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length,
);

export const selectIsWishlistLoading = createSelector(
  [selectWishlistState],
  (wishlist) => wishlist?.isLoading || false,
);

export const selectIsItemInWishlist = (productId: string) =>
  createSelector([selectWishlistItems], (items) =>
    items.some((item) => item.id === productId || (item as any)._id === productId),
  );
