import { createAsyncThunk } from "@reduxjs/toolkit";
import { paymentService } from "./payment.service";
import { getErrorMessage } from "../../utils/helpers";
import type { Payment, PaymentStatus } from "./payment.types";

export const fetchPaymentByOrderThunk = createAsyncThunk<
  Payment,
  string,
  { rejectValue: string }
>("payment/fetchByOrder", async (orderId, { rejectWithValue }) => {
  try {
    return await paymentService.getPaymentByOrder(orderId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAllPaymentsThunk = createAsyncThunk<
  Payment[],
  void,
  { rejectValue: string }
>("payment/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await paymentService.getAllPayments();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updatePaymentStatusThunk = createAsyncThunk<
  Payment,
  { id: string; status: PaymentStatus },
  { rejectValue: string }
>("payment/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    return await paymentService.updatePaymentStatus(id, status);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
