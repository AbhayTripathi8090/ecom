import React from "react";
import { Truck, MapPin } from "lucide-react";

export const AdminShippingPage: React.FC = () => {
  const mockShipments = [
    { id: "SHP-801", order: "ORD-9841", carrier: "FedEx", trackingNumber: "FX-9041289", status: "In Transit", destination: "New York, USA" },
    { id: "SHP-802", order: "ORD-9842", carrier: "DHL Express", trackingNumber: "DHL-481920", status: "Delivered", destination: "California, USA" },
    { id: "SHP-803", order: "ORD-9843", carrier: "UPS", trackingNumber: "UPS-110293", status: "Preparing", destination: "Texas, USA" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-indigo-400" />
          Shipping & Logistics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage fulfillment logistics, carrier integrations, and package tracking
        </p>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase">
              <tr>
                <th className="p-4">Shipment ID</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Carrier</th>
                <th className="p-4">Tracking Code</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mockShipments.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40">
                  <td className="p-4 font-bold text-white">{s.id}</td>
                  <td className="p-4 text-slate-300">{s.order}</td>
                  <td className="p-4 text-slate-200">{s.carrier}</td>
                  <td className="p-4 text-xs font-mono text-indigo-400">{s.trackingNumber}</td>
                  <td className="p-4 text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {s.destination}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {s.status}
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
