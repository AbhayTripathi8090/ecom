export interface DashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  printingOrders: number;
  deliveredOrders: number;
  lowStockProducts: number;
  recentOrders?: any[];
}

export interface DashboardState {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
}
