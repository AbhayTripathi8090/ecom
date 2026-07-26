import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartState, CartItem } from "./cart.types";
import {
  fetchCartThunk,
  addToCartThunk,
  updateCartItemThunk,
  removeCartItemThunk,
  clearCartThunk,
} from "./cart.thunk";

const calculateSummary = (items: CartItem[]) => {
  const subtotal = items.reduce((acc, item) => acc + (item.itemTotal || item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const shipping = subtotal > 1000 || items.length === 0 ? 0 : 50; // free shipping over $1000
  const discount = 0;
  const total = subtotal + tax + shipping - discount;

  return { subtotal, tax, shipping, discount, total };
};

const initialState: CartState = {
  items: [],
  summary: { subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 },
  isLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemLocal: (state, action: PayloadAction<CartItem>) => {
      const existingIdx = state.items.findIndex(
        (i) => i.product.id === action.payload.product.id
      );
      if (existingIdx >= 0) {
        state.items[existingIdx].quantity += action.payload.quantity;
        state.items[existingIdx].itemTotal =
          state.items[existingIdx].price * state.items[existingIdx].quantity;
      } else {
        state.items.push(action.payload);
      }
      state.summary = calculateSummary(state.items);
    },
    removeItemLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload && i.product.id !== action.payload);
      state.summary = calculateSummary(state.items);
    },
    updateQuantityLocal: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id || i.product.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        item.itemTotal = item.price * item.quantity;
      }
      state.summary = calculateSummary(state.items);
    },
    clearCartLocal: (state) => {
      state.items = [];
      state.summary = { subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCartThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.length > 0) {
        state.items = action.payload;
        state.summary = calculateSummary(state.items);
      }
    });
    builder.addCase(fetchCartThunk.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(addToCartThunk.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        state.items = action.payload;
        state.summary = calculateSummary(state.items);
      }
    });

    builder.addCase(updateCartItemThunk.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        state.items = action.payload;
        state.summary = calculateSummary(state.items);
      }
    });

    builder.addCase(removeCartItemThunk.fulfilled, (state, action) => {
      state.items = action.payload;
      state.summary = calculateSummary(state.items);
    });

    builder.addCase(clearCartThunk.fulfilled, (state) => {
      state.items = [];
      state.summary = { subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 };
    });
  },
});

export const { addItemLocal, removeItemLocal, updateQuantityLocal, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
