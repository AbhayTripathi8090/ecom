import { createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "./order.service";
import { getErrorMessage } from "../../utils/helpers";
import type { Order, CreateOrderInput, OrderWorkflowStatus } from "./order.types";

export const createOrderThunk = createAsyncThunk<
  Order,
  CreateOrderInput,
  { rejectValue: string }
>("order/createOrder", async (input, { rejectWithValue }) => {
  try {
    return await orderService.createOrder(input);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchMyOrdersThunk = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("order/fetchMyOrders", async (_, { rejectWithValue }) => {
  try {
    return await orderService.getMyOrders();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAllOrdersThunk = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("order/fetchAllOrders", async (_, { rejectWithValue }) => {
  try {
    return await orderService.getAllOrders();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchOrderByIdThunk = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("order/fetchOrderById", async (id, { rejectWithValue }) => {
  try {
    return await orderService.getOrderById(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateOrderStatusThunk = createAsyncThunk<
  Order,
  { id: string; status: OrderWorkflowStatus },
  { rejectValue: string }
>("order/updateOrderStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    return await orderService.updateOrderStatus(id, status);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const cancelOrderThunk = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("order/cancelOrder", async (id, { rejectWithValue }) => {
  try {
    return await orderService.cancelOrder(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
