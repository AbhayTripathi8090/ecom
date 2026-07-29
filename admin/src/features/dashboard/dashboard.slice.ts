import { createSlice } from "@reduxjs/toolkit";
import type { DashboardState } from "./dashboard.types";
import { fetchDashboardMetricsThunk } from "./dashboard.thunk";

const initialState: DashboardState = {
  metrics: null,
  isLoading: false,
  error: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardMetricsThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchDashboardMetricsThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.metrics = action.payload;
    });
    builder.addCase(fetchDashboardMetricsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to load dashboard metrics";
    });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
