import { createSlice } from "@reduxjs/toolkit";
import type { ShippingState } from "./shipping.types";
import { fetchMyAddressesThunk, createAddressThunk, deleteAddressThunk } from "./shipping.thunk";

const initialState: ShippingState = {
  addresses: [],
  currentShipment: null,
  isLoading: false,
  error: null,
};

export const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    clearShippingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyAddressesThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMyAddressesThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addresses = action.payload;
    });
    builder.addCase(fetchMyAddressesThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load addresses";
    });

    builder.addCase(createAddressThunk.fulfilled, (state, action) => {
      state.addresses.push(action.payload);
    });

    builder.addCase(deleteAddressThunk.fulfilled, (state, action) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
    });
  },
});

export const { clearShippingError } = shippingSlice.actions;
export default shippingSlice.reducer;
