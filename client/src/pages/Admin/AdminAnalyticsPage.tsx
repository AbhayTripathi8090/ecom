import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, DollarSign, Users, ShoppingBag, ArrowUpRight, FolderTree } from "lucide-react";
import { api } from "../../lib/api";
import { formatCurrency } from "../../utils/formatters";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  deliveredOrders: number;
  totalCustomers: number;
  categories: { id: string; name: string }[];
}

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    totalCustomers: 0,
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const [dashRes, usersRes, catRes]: [any, any, any] = await Promise.all([
          api.get("/dashboard").catch(() => null),
          api.get("/admin/users").catch(() => null),
          api.get("/categories").catch(() => null),
        ]);

        const dashObj = dashRes?.data?.dashboard || dashRes?.dashboard || dashRes?.data || {};
        const totals = dashObj.totals || {};

        const usersData = usersRes?.data?.users || (Array.isArray(usersRes?.data) ? usersRes.data : []);
        const totalCust = usersRes?.data?.meta?.total || usersData.length || totals.users || 0;

        const catData = catRes?.data?.categories || (Array.isArray(catRes?.data) ? catRes.data : []);

        const rev = dashObj.totalRevenue ?? totals.revenue ?? 0;
        const ords = dashObj.totalOrders ?? totals.orders ?? 0;
        const deliv = dashObj.deliveredOrders ?? 0;

        setData({
          totalRevenue: rev,
          totalOrders: ords,
          deliveredOrders: deliv,
          totalCustomers: totalCust,
          categories: catData,
        });
      } catch (e) {
        console.error("Failed to fetch analytics data", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const averageOrderValue = data.totalOrders > 0 ? data.totalRevenue / data.totalOrders : 0;
  const fulfillmentRate = data.totalOrders > 0 ? ((data.deliveredOrders / data.totalOrders) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Store Analytics & Reports
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Deep-dive store metrics, revenue trends, customer growth, and merchandise category insights
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Gross Revenue</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{formatCurrency(data.totalRevenue)}</div>
              <div className="flex items-center text-xs text-emerald-400 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                Verified store sales
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{data.totalCustomers} Customers</div>
              <div className="flex items-center text-xs text-indigo-400 font-medium">
                Active account base
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Fulfillment Rate</span>
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{fulfillmentRate}%</div>
              <div className="flex items-center text-xs text-violet-400 font-medium">
                Delivered vs total orders
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Average Order Value</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{formatCurrency(averageOrderValue)}</div>
              <div className="flex items-center text-xs text-slate-400 font-medium">
                Average basket size
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-indigo-400" />
              Active Product Categories ({data.categories.length})
            </h3>
            {data.categories.length === 0 ? (
              <p className="text-xs text-slate-400">No active categories found in database.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                {data.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"
                  >
                    <span className="font-medium text-white">{cat.name}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
