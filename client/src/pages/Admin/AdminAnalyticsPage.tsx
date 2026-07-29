import React from "react";
import { BarChart3, TrendingUp, DollarSign, Users, ShoppingBag, ArrowUpRight } from "lucide-react";

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Store Analytics & Reports
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Deep-dive store metrics, revenue trends, customer growth, and top-selling product statistics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Monthly Gross Sales</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">$45,280.00</div>
          <div className="flex items-center text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            +18.4% vs last month
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">New Customers</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">+142 Users</div>
          <div className="flex items-center text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            +12.1% growth rate
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Conversion Rate</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">3.85%</div>
          <div className="flex items-center text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            +0.4% conversion uplift
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Average Order Value</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">$124.50</div>
          <div className="flex items-center text-xs text-slate-400 font-medium">
            Steady average basket size
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          Top Performing Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span>3D Printed Art & Models</span>
            <span className="font-bold text-indigo-400">42% Sales</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span>Custom Accessories</span>
            <span className="font-bold text-indigo-400">31% Sales</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span>Prototyping Kits</span>
            <span className="font-bold text-indigo-400">27% Sales</span>
          </div>
        </div>
      </div>
    </div>
  );
};
