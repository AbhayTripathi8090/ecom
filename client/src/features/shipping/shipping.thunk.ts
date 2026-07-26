import { createAsyncThunk } from "@reduxjs/toolkit";
import { shippingService } from "./shipping.service";
import { getErrorMessage } from "../../utils/helpers";
import type { SavedAddress } from "./shipping.types";
import type { ShippingAddressInput } from "../order/order.types";

export const fetchMyAddressesThunk = createAsyncThunk<
  SavedAddress[],
  void,
  { rejectValue: string }
>("shipping/fetchMyAddresses", async (_, { rejectWithValue }) => {
  try {
    return await shippingService.getMyAddresses();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createAddressThunk = createAsyncThunk<
  SavedAddress,
  ShippingAddressInput,
  { rejectValue: string }
>("shipping/createAddress", async (input, { rejectWithValue }) => {
  try {
    return await shippingService.createAddress(input);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteAddressThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("shipping/deleteAddress", async (id, { rejectWithValue }) => {
  try {
    await shippingService.deleteAddress(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
