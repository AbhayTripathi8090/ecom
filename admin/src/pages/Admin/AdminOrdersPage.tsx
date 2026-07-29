import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { ShoppingBag, ArrowRight, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchAllOrdersThunk,
  updateOrderStatusThunk,
  selectAllOrders,
  ORDER_WORKFLOW_STEPS,
} from "../../features/order";
import type { OrderWorkflowStatus } from "../../features/order";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const AdminOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);

  useEffect(() => {
    dispatch(fetchAllOrdersThunk());
  }, [dispatch]);

  const handleUpdateStatus = async (orderId: string, currentStatus: string, newStatus: string) => {
    const currentIdx = ORDER_WORKFLOW_STEPS.indexOf(currentStatus as any);
    const targetIdx = ORDER_WORKFLOW_STEPS.indexOf(newStatus as any);

    if (targetIdx !== currentIdx + 1) {
      toast.error(`Order Workflow Rule: Must advance step by step.`);
      return;
    }

    try {
      const resultAction = await dispatch(
        updateOrderStatusThunk({ id: orderId, status: newStatus as OrderWorkflowStatus })
      );
      if (updateOrderStatusThunk.fulfilled.match(resultAction)) {
        toast.success(`Updated order status: ${currentStatus} → ${newStatus}`);
      } else {
        toast.error(resultAction.payload || "Failed to update order status");
      }
    } catch {
      toast.error("Error updating order status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-indigo-400" />
          Orders Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor customer purchases and advance order workflow status sequentially
        </p>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Advance Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((order) => {
                const currentIdx = ORDER_WORKFLOW_STEPS.indexOf(order.orderStatus as any);
                const nextStep =
                  currentIdx >= 0 && currentIdx < ORDER_WORKFLOW_STEPS.length - 1
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
    </div>
  );
};
