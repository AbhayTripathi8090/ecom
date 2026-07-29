import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Package,
  CheckCircle,
  Clock,
  ArrowLeft,
  Truck,
  AlertCircle,
  MapPin,
  XCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchOrderByIdThunk,
  cancelOrderThunk,
  selectSelectedOrder,
  selectOrderLoading,
  ORDER_WORKFLOW_STEPS,
} from "../../features/order";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const order = useAppSelector(selectSelectedOrder);
  const isLoading = useAppSelector(selectOrderLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderByIdThunk(id));
    }
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    if (!id) return;
    if (confirm("Are you sure you want to cancel this order?")) {
      const resultAction = await dispatch(cancelOrderThunk(id));
      if (cancelOrderThunk.fulfilled.match(resultAction)) {
        toast.success("Order cancelled successfully!");
      } else {
        toast.error(resultAction.payload || "Failed to cancel order.");
      }
    }
  };

  if (isLoading && !order) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
        <Link to="/orders">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const isCancelled = order.orderStatus === "cancelled";
  const currentStepIdx = ORDER_WORKFLOW_STEPS.indexOf(order.orderStatus as any);
  const canCancel =
    !isCancelled &&
    (order.orderStatus === "pending" || order.orderStatus === "confirmed");

  return (
    <div className="space-y-8 py-4">
      <Link to="/orders" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white">Order #{order.orderNumber || order.id.slice(-6)}</h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${
                isCancelled
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
              }`}
            >
              {order.orderStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400">Placed on {formatDate(order.createdAt)}</p>
        </div>

        {canCancel && (
          <Button variant="danger" size="sm" onClick={handleCancelOrder}>
            <XCircle className="w-4 h-4 mr-1.5" />
            Cancel Order
          </Button>
        )}
      </div>

      {/* 10-Step Order Lifecycle Timeline */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          Order Production & Delivery Timeline
        </h2>

        {isCancelled ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>This order was cancelled on request before production started.</span>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-800">
            {ORDER_WORKFLOW_STEPS.map((step, idx) => {
              const isPassed = currentStepIdx >= idx;
              const isCurrent = currentStepIdx === idx;

              return (
                <div key={step} className="relative flex items-center justify-between">
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isPassed
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/30"
                        : "bg-slate-900 border-slate-800 text-slate-600"
                    }`}
                  >
                    {isPassed ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-slate-700" />}
                  </div>

                  <div className="space-y-0.5">
                    <span
                      className={`text-sm font-semibold ${
                        isCurrent
                          ? "text-indigo-400"
                          : isPassed
                          ? "text-slate-200"
                          : "text-slate-500"
                      }`}
                    >
                      {step}
                    </span>
                    {isCurrent && (
                      <span className="block text-[11px] text-indigo-400 font-medium">Current Status in Progress</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid Details: Items & Address */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Order Items */}
        <div className="md:col-span-8 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            Order Items ({order.items?.length || 0})
          </h3>

          <div className="space-y-4 border-t border-slate-800 pt-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 text-sm pb-4 border-b border-slate-800/60 last:border-b-0">
                <div className="space-y-1">
                  <span className="font-semibold text-white">{item.product?.name || "Merchandise Item"}</span>
                  {item.customization && (
                    <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                      {item.customization.size && <span>Size: {item.customization.size} • </span>}
                      {item.customization.color && <span>Color: {item.customization.color} • </span>}
                      {item.customization.printType && <span>Print: {item.customization.printType}</span>}
                    </div>
                  )}
                  <div className="text-xs text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</div>
                </div>
                <span className="font-bold text-white">{formatCurrency(item.itemTotal || item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              Delivery Address
            </h3>
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-white block">{order.shippingAddress?.fullName}</span>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="text-slate-400 pt-1">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 text-sm">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-400" />
              Shipment Information
            </h3>
            <div className="text-xs text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Courier:</span>
                <span className="font-semibold text-slate-200">{order.courierName || "Shiprocket Express"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tracking #:</span>
                <span className="font-mono text-indigo-400">{order.trackingNumber || "TRK-987421-IN"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
