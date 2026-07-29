import type { RootState } from "../../store";

export const selectCurrentPayment = (state: RootState) => state.payment.currentPayment;
export const selectAllPayments = (state: RootState) => state.payment.allPayments;
export const selectPaymentLoading = (state: RootState) => state.payment.isLoading;
export const selectPaymentError = (state: RootState) => state.payment.error;
