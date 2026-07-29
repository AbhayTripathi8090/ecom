import React, { useEffect, useState } from "react";
import { CreditCard, DollarSign, Clock, ShieldCheck } from "lucide-react";
import { api } from "../../lib/api";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

interface PaymentItem {
  id: string;
  rawId?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  method: string;
  status: string;
  transactionId?: string;
  date: string;
}

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [pendingSettlements, setPendingSettlements] = useState(0);
  const [activeMethods, setActiveMethods] = useState<string[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchPaymentsData = async () => {
    setIsLoading(true);
    try {
      const resPayments: any = await api.get("/payments");
      const paymentsData = resPayments?.data?.payments || (Array.isArray(resPayments?.data) ? resPayments.data : []);

      const resOrders: any = await api.get("/orders");
      const ordersData = resOrders?.data?.orders || (Array.isArray(resOrders?.data) ? resOrders.data : []);

      let list: PaymentItem[] = [];
      let processedSum = 0;
      let pendingSum = 0;
      const methodsSet = new Set<string>();

      if (paymentsData.length > 0) {
        list = paymentsData.map((p: any) => {
          const isPaid = p.status === "paid" || p.status === "completed";
          if (isPaid) processedSum += p.amount || 0;
          else pendingSum += p.amount || 0;
          if (p.method) methodsSet.add(p.method.toUpperCase());

          return {
            id: p.transactionId || p._id || p.id,
            rawId: p._id || p.id,
            orderNumber: p.order?.orderNumber || "ORD-REF",
            customerName: p.user?.name || "Customer",
            customerEmail: p.user?.email || "",
            amount: p.amount || p.order?.totalAmount || 0,
            method: p.method || p.provider || "Online",
            status: p.status || "pending",
            date: p.createdAt || new Date().toISOString(),
          };
        });
      } else {
        list = ordersData.map((o: any) => {
          const isPaid = o.paymentStatus === "paid";
          if (isPaid) processedSum += o.totalAmount || 0;
          else pendingSum += o.totalAmount || 0;
          if (o.paymentMethod) methodsSet.add(o.paymentMethod.toUpperCase());

          return {
            id: `TXN-${(o.id || o._id || "").slice(-8).toUpperCase()}`,
            rawId: o.id || o._id,
            orderNumber: o.orderNumber || (o.id || o._id || "").slice(-6),
            customerName: o.shippingAddress?.fullName || o.user?.name || "Customer",
            customerEmail: o.user?.email || "",
            amount: o.totalAmount || 0,
            method: o.paymentMethod || "COD",
            status: o.paymentStatus || "pending",
            date: o.createdAt,
          };
        });
      }

      setPayments(list);
      setTotalProcessed(processedSum);
      setPendingSettlements(pendingSum);
      setActiveMethods(Array.from(methodsSet));
    } catch (e) {
      console.error("Failed to fetch payments data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const handleMarkAsPaid = async (payment: PaymentItem) => {
    if (!payment.rawId) return;
    setUpdatingId(payment.id);
    try {
      await api.patch(`/payments/${payment.rawId}/status`, { status: "paid" });
      await fetchPaymentsData();
    } catch (err) {
      console.error("Failed to update payment status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-indigo-400" />
          Payments & Transactions
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Track payment transactions, gateway processing logs, and store settlement metrics ({payments.length} Transactions)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Total Processed Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{formatCurrency(totalProcessed)}</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Pending Settlements</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{formatCurrency(pendingSettlements)}</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Active Payment Gateways</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-indigo-400">
            {activeMethods.length > 0 ? activeMethods.join(", ") : "COD, Card, UPI"}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CreditCard className="w-8 h-8 mx-auto text-slate-500" />
            <p className="text-sm font-medium">No payment transactions recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white font-mono text-xs">{p.id}</td>
                    <td className="p-4 text-slate-300 font-semibold">#{p.orderNumber}</td>
                    <td className="p-4 text-slate-200">
                      <div>{p.customerName}</div>
                      {p.customerEmail && (
                        <div className="text-xs text-slate-500">{p.customerEmail}</div>
                      )}
                    </td>
                    <td className="p-4 text-xs font-semibold text-slate-400 uppercase">{p.method}</td>
                    <td className="p-4 font-semibold text-slate-100">{formatCurrency(p.amount)}</td>
                    <td className="p-4 text-xs text-slate-400">{formatDate(p.date)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          p.status === "paid" || p.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : p.status === "failed"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {p.status === "pending" && p.rawId ? (
                        <button
                          disabled={updatingId === p.id}
                          onClick={() => handleMarkAsPaid(p)}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          {updatingId === p.id ? "Updating..." : "Mark as Paid"}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
