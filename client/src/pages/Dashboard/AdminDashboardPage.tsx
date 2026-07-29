import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Printer,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchDashboardMetricsThunk,
  selectDashboardMetrics,
  selectDashboardLoading,
} from "../../features/dashboard";
import {
  fetchAllOrdersThunk,
  updateOrderStatusThunk,
  selectAllOrders,
  ORDER_WORKFLOW_STEPS,
} from "../../features/order";
import type { OrderWorkflowStatus } from "../../features/order";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(selectDashboardMetrics);
  const orders = useAppSelector(selectAllOrders);
  const isLoading = useAppSelector(selectDashboardLoading);

  const [activeTab, setActiveTab] = useState<"orders" | "metrics">("orders");

  useEffect(() => {
    dispatch(fetchDashboardMetricsThunk());
    dispatch(fetchAllOrdersThunk());
  }, [dispatch]);

  const handleUpdateStatus = async (orderId: string, currentStatus: string, newStatus: string) => {
    const currentIdx = ORDER_WORKFLOW_STEPS.indexOf(currentStatus as any);
    const targetIdx = ORDER_WORKFLOW_STEPS.indexOf(newStatus as any);

    // Rule: Cannot skip workflow steps
    if (targetIdx !== currentIdx + 1) {
      toast.error(
        `Order Workflow Rule: Must advance step by step. Cannot skip from "${currentStatus}" directly to "${newStatus}".`
      );
      return;
    }

    try {
      const resultAction = await dispatch(
        updateOrderStatusThunk({ id: orderId, status: newStatus as OrderWorkflowStatus })
      );
      if (updateOrderStatusThunk.fulfilled.match(resultAction)) {
        toast.success(`Order workflow updated: ${currentStatus} → ${newStatus}`);
      } else {
        toast.error(resultAction.payload || "Failed to update order status");
      }
    } catch {
      toast.error("Error updating order status");
    }
  };

  if (isLoading && !metrics && orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(metrics?.totalRevenue ?? 0),
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Total Orders",
      value: metrics?.totalOrders ?? orders.length,
      icon: ShoppingBag,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Printing In Progress",
      value: metrics?.printingOrders ?? 0,
      icon: Printer,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    },
    {
      title: "Low Stock Alert",
      value: metrics?.lowStockProducts ?? 0,
      icon: AlertTriangle,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin Management Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Sales & Order Operations</h1>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "orders" ? "bg-indigo-600 text-white font-semibold shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Order Workflow ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "metrics" ? "bg-indigo-600 text-white font-semibold shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Sales Analytics
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{card.title}</span>
                <div className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Main Tab Content */}
      {activeTab === "orders" ? (
        /* Order Workflow Management Table */
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-400" />
              Order Workflow Management
            </h3>
            <span className="text-xs text-slate-400">Strict sequential step-by-step updates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Current Status</th>
                  <th className="p-3.5">Advance Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((order) => {
                  const currentIdx = ORDER_WORKFLOW_STEPS.indexOf(order.orderStatus as any);
                  const nextStep = currentIdx >= 0 && currentIdx < ORDER_WORKFLOW_STEPS.length - 1
                    ? ORDER_WORKFLOW_STEPS[currentIdx + 1]
                    : null;

                  return (
                    <tr key={order.id} className="hover:bg-slate-900/40">
                      <td className="p-3.5 font-bold text-white">#{order.orderNumber || order.id.slice(-6)}</td>
                      <td className="p-3.5 text-slate-200">{order.shippingAddress?.fullName || "Customer"}</td>
                      <td className="p-3.5 text-xs text-slate-400">{formatDate(order.createdAt)}</td>
                      <td className="p-3.5 font-semibold text-slate-100">{formatCurrency(order.totalAmount)}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {nextStep ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, order.orderStatus, nextStep)}
                            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
                          >
                            <span>Next: {nextStep}</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Delivered
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Analytics Summary View */
        <div className="glass-card p-8 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Store Sales & Performance Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300 text-sm">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs">Total Merchandise Catalog</span>
              <div className="text-xl font-bold text-white">{metrics?.totalProducts ?? 0} Products</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs">Pending Fulfillment</span>
              <div className="text-xl font-bold text-amber-400">{metrics?.pendingOrders ?? 0} Orders</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs">Delivered Orders</span>
              <div className="text-xl font-bold text-emerald-400">{metrics?.deliveredOrders ?? 0} Orders</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
