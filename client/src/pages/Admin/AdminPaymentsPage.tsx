import React from "react";
import { CreditCard } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const AdminPaymentsPage: React.FC = () => {
  const mockPayments = [
    { id: "PAY-1001", order: "ORD-9841", customer: "John Doe", amount: 149.99, method: "Credit Card", status: "Completed", date: "2026-07-28" },
    { id: "PAY-1002", order: "ORD-9842", customer: "Sarah Smith", amount: 299.50, method: "PayPal", status: "Completed", date: "2026-07-28" },
    { id: "PAY-1003", order: "ORD-9843", customer: "Michael Brown", amount: 85.00, method: "Stripe", status: "Processing", date: "2026-07-29" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-indigo-400" />
          Payments & Transactions
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Track payment transactions, gateway processing logs, and store settlement metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total Processed</span>
          <div className="text-2xl font-bold text-emerald-400">$18,450.00</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Pending Settlements</span>
          <div className="text-2xl font-bold text-amber-400">$1,240.00</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Payment Gateways</span>
          <div className="text-2xl font-bold text-indigo-400">Stripe & PayPal</div>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mockPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/40">
                  <td className="p-4 font-bold text-white">{p.id}</td>
                  <td className="p-4 text-slate-300">{p.order}</td>
                  <td className="p-4 text-slate-200">{p.customer}</td>
                  <td className="p-4 text-xs text-slate-400">{p.method}</td>
                  <td className="p-4 font-semibold text-slate-100">{formatCurrency(p.amount)}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
