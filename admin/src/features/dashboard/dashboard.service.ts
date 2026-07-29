import { api } from "../../lib/api";
import { DASHBOARD_ENDPOINTS } from "./dashboard.endpoints";
import type { DashboardMetrics } from "./dashboard.types";

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const res: any = await api.get(DASHBOARD_ENDPOINTS.METRICS);
      const data = res.data?.dashboard || res.dashboard || res.data || res;
      const totals = data.totals || {};

      return {
        totalProducts: data.totalProducts ?? totals.products ?? 0,
        totalOrders: data.totalOrders ?? totals.orders ?? 0,
        totalRevenue: data.totalRevenue ?? totals.revenue ?? 0,
        pendingOrders: data.pendingOrders ?? totals.pendingOrders ?? 0,
        printingOrders: data.printingOrders ?? totals.processingOrders ?? 0,
        deliveredOrders: data.deliveredOrders ?? 0,
        lowStockProducts:
          typeof data.lowStockProducts === "number"
            ? data.lowStockProducts
            : Array.isArray(data.lowStockProducts)
              ? data.lowStockProducts.length
              : 0,
        recentOrders: data.recentOrders || [],
      };
    } catch {
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        printingOrders: 0,
        deliveredOrders: 0,
        lowStockProducts: 0,
        recentOrders: [],
      };
    }
  },
};
