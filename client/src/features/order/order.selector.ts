import type { RootState } from "../../store";

export const selectMyOrders = (state: RootState) => state.order.myOrders;
export const selectAllOrders = (state: RootState) => state.order.allOrders;
export const selectSelectedOrder = (state: RootState) => state.order.selectedOrder;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;
