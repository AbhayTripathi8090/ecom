import { createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "./cart.service";
import { getErrorMessage } from "../../utils/helpers";
import type { CartItem, AddToCartInput, UpdateCartItemInput } from "./cart.types";

export const fetchCartThunk = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    return await cartService.getCart();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addToCartThunk = createAsyncThunk<
  CartItem[],
  AddToCartInput,
  { rejectValue: string }
>("cart/addToCart", async (input, { rejectWithValue }) => {
  try {
    return await cartService.addToCart(input);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateCartItemThunk = createAsyncThunk<
  CartItem[],
  { productId: string; input: UpdateCartItemInput },
  { rejectValue: string }
>("cart/updateCartItem", async ({ productId, input }, { rejectWithValue }) => {
  try {
    return await cartService.updateCartItem(productId, input);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const removeCartItemThunk = createAsyncThunk<
  CartItem[],
  string,
  { rejectValue: string }
>("cart/removeCartItem", async (productId, { rejectWithValue }) => {
  try {
    return await cartService.removeCartItem(productId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const clearCartThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("cart/clearCart", async (_, { rejectWithValue }) => {
  try {
    await cartService.clearCart();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
