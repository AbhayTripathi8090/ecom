import type { RootState } from "../../store";

export const selectDashboardMetrics = (state: RootState) => state.dashboard.metrics;
export const selectDashboardLoading = (state: RootState) => state.dashboard.isLoading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
