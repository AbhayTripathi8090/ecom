import { createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardService } from "./dashboard.service";
import { getErrorMessage } from "../../utils/helpers";
import type { DashboardMetrics } from "./dashboard.types";

export const fetchDashboardMetricsThunk = createAsyncThunk<
  DashboardMetrics,
  void,
  { rejectValue: string }
>("dashboard/fetchMetrics", async (_, { rejectWithValue }) => {
  try {
    return await dashboardService.getMetrics();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
