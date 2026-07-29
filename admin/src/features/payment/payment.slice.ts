import { createSlice } from "@reduxjs/toolkit";
import type { PaymentState } from "./payment.types";
import { fetchPaymentByOrderThunk, fetchAllPaymentsThunk, updatePaymentStatusThunk } from "./payment.thunk";

const initialState: PaymentState = {
  currentPayment: null,
  allPayments: [],
  isLoading: false,
  error: null,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPaymentByOrderThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPaymentByOrderThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentPayment = action.payload;
    });
    builder.addCase(fetchPaymentByOrderThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load payment info";
    });

    builder.addCase(fetchAllPaymentsThunk.fulfilled, (state, action) => {
      state.allPayments = action.payload;
    });

    builder.addCase(updatePaymentStatusThunk.fulfilled, (state, action) => {
      if (state.currentPayment?.id === action.payload.id) {
        state.currentPayment = action.payload;
      }
      const idx = state.allPayments.findIndex((p) => p.id === action.payload.id);
      if (idx >= 0) state.allPayments[idx] = action.payload;
    });
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
