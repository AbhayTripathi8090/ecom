import { api } from "../../lib/api";
import { DASHBOARD_ENDPOINTS } from "./dashboard.endpoints";
import type { DashboardMetrics } from "./dashboard.types";

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const res: any = await api.get(DASHBOARD_ENDPOINTS.METRICS);
      const data = res.data || res;
      return data.metrics || data.overview || data;
    } catch {
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        printingOrders: 0,
        deliveredOrders: 0,
        lowStockProducts: 0,
      };
    }
  },
};
