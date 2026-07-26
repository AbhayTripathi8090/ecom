import { createSlice } from "@reduxjs/toolkit";
import type { OrderState } from "./order.types";
import {
  createOrderThunk,
  fetchMyOrdersThunk,
  fetchAllOrdersThunk,
  fetchOrderByIdThunk,
  updateOrderStatusThunk,
  cancelOrderThunk,
} from "./order.thunk";

const initialState: OrderState = {
  myOrders: [],
  allOrders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder.addCase(createOrderThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createOrderThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.myOrders.unshift(action.payload);
      state.selectedOrder = action.payload;
    });
    builder.addCase(createOrderThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to create order";
    });

    // Fetch My Orders
    builder.addCase(fetchMyOrdersThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.myOrders = action.payload;
    });
    builder.addCase(fetchMyOrdersThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load orders";
    });

    // Fetch All Orders (Admin)
    builder.addCase(fetchAllOrdersThunk.fulfilled, (state, action) => {
      state.allOrders = action.payload;
    });

    // Fetch Order By Id
    builder.addCase(fetchOrderByIdThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedOrder = action.payload;
    });
    builder.addCase(fetchOrderByIdThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load order details";
    });

    // Update Order Status (Admin)
    builder.addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
      const idx = state.allOrders.findIndex((o) => o.id === action.payload.id);
      if (idx >= 0) state.allOrders[idx] = action.payload;

      const myIdx = state.myOrders.findIndex((o) => o.id === action.payload.id);
      if (myIdx >= 0) state.myOrders[myIdx] = action.payload;

      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
    });

    // Cancel Order
    builder.addCase(cancelOrderThunk.fulfilled, (state, action) => {
      const myIdx = state.myOrders.findIndex((o) => o.id === action.payload.id);
      if (myIdx >= 0) state.myOrders[myIdx] = action.payload;

      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
    });
  },
});

export const { clearOrderError, setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
