import React, { useEffect, useState } from "react";
import { Truck, MapPin, Package, CheckCircle, Clock } from "lucide-react";
import { api } from "../../lib/api";
import { formatDate } from "../../utils/formatters";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

interface ShipmentItem {
  id: string;
  orderNumber: string;
  customerName: string;
  carrier: string;
  trackingNumber: string;
  destination: string;
  status: string;
  date: string;
}

export const AdminShippingPage: React.FC = () => {
  const [shipments, setShipments] = useState<ShipmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShippingData = async () => {
      setIsLoading(true);
      try {
        const res: any = await api.get("/orders");
        const orders = res?.data?.orders || (Array.isArray(res?.data) ? res.data : []);

        const mapped: ShipmentItem[] = orders.map((o: any) => {
          const addr = o.shippingAddress || {};
          const destParts = [addr.city, addr.state, addr.country].filter(Boolean);
          const destination = destParts.length > 0 ? destParts.join(", ") : "Customer Address";

          return {
            id: `SHP-${(o.id || o._id || "").slice(-6).toUpperCase()}`,
            orderNumber: o.orderNumber || (o.id || o._id || "").slice(-6),
            customerName: addr.fullName || o.user?.name || "Customer",
            carrier: o.courierName || "Standard Express",
            trackingNumber: o.trackingNumber || `TRK-${(o.id || o._id || "").slice(-8).toUpperCase()}`,
            destination,
            status: o.orderStatus || "pending",
            date: o.createdAt,
          };
        });

        setShipments(mapped);
      } catch (e) {
        console.error("Failed to fetch shipping data", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShippingData();
  }, []);

  const inTransitCount = shipments.filter((s) => s.status === "shipped" || s.status === "processing").length;
  const deliveredCount = shipments.filter((s) => s.status === "delivered").length;
  const pendingCount = shipments.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-indigo-400" />
          Shipping & Logistics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage fulfillment logistics, carrier integrations, and package tracking ({shipments.length} Active Shipments)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Pending Dispatch</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{pendingCount} Orders</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>In Transit</span>
            <Package className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400">{inTransitCount} Orders</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Delivered Shipments</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{deliveredCount} Orders</div>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : shipments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Truck className="w-8 h-8 mx-auto text-slate-500" />
            <p className="text-sm font-medium">No order shipments logged yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase">
                <tr>
                  <th className="p-4">Shipment ID</th>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Carrier</th>
                  <th className="p-4">Tracking Code</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white font-mono text-xs">{s.id}</td>
                    <td className="p-4 text-slate-300 font-semibold">#{s.orderNumber}</td>
                    <td className="p-4 text-slate-200">{s.customerName}</td>
                    <td className="p-4 text-xs text-slate-400 font-medium">{s.carrier}</td>
                    <td className="p-4 text-xs font-mono text-indigo-400">{s.trackingNumber}</td>
                    <td className="p-4 text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{s.destination}</span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">{formatDate(s.date)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          s.status === "delivered"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : s.status === "shipped" || s.status === "processing"
                              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {s.status}
                      </span>
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
