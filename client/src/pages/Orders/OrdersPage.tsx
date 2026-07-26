import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, ChevronRight, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchMyOrdersThunk,
  selectMyOrders,
  selectOrderLoading,
} from "../../features/order";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const OrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectMyOrders);
  const isLoading = useAppSelector(selectOrderLoading);

  useEffect(() => {
    dispatch(fetchMyOrdersThunk());
  }, [dispatch]);

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          <Package className="w-3.5 h-3.5" />
          <span>My Orders</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Order History & Tracking</h1>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto" />
          <h2 className="text-2xl font-bold text-white">No orders placed yet</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            You haven't placed any merchandise orders. Browse our products to place your first custom order!
          </p>
          <Link to="/products">
            <button className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all">
              Browse Merchandise
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isCancelled = order.orderStatus === "Cancelled";
            const isDelivered = order.orderStatus === "Delivered";

            return (
              <div
                key={order.id}
                className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-white text-lg">Order #{order.orderNumber || order.id.slice(-6)}</span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${
                        isCancelled
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : isDelivered
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(order.createdAt)}
                    </span>
                    <span>•</span>
                    <span>{order.items?.length || 0} Item(s)</span>
                    <span>•</span>
                    <span className="font-bold text-slate-200">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <span>Track Lifecycle</span>
                  <ChevronRight className="w-4 h-4 ml-1 text-indigo-400" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
