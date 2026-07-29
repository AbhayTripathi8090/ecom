import React, { useEffect, useState } from "react";
import { Users, Search, UserCheck, UserX } from "lucide-react";
import { api } from "../../lib/api";
import { formatDate } from "../../utils/formatters";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive?: boolean;
}

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const res: any = await api.get("/admin/users");
        const data = res?.data || res;
        const rawUsers = data?.users || (Array.isArray(data) ? data : []);
        const normalized = rawUsers.map((u: any) => ({
          ...u,
          id: u.id || u._id,
        }));
        setCustomers(normalized);
      } catch (e) {
        console.error("Failed to fetch customers", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-400" />
          Customers Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage registered customer user accounts and active roles ({customers.length} Users)
        </p>
      </div>

      <div className="glass-card p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-500" />
            <p className="text-sm font-medium">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-semibold text-white flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold flex items-center justify-center text-xs">
                        {(user.name?.[0] || "U").toUpperCase()}
                      </div>
                      <span>{user.name || "Customer"}</span>
                    </td>
                    <td className="p-4 text-slate-300">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">{formatDate(user.createdAt)}</td>
                    <td className="p-4">
                      {user.isActive !== false ? (
                        <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                          <UserCheck className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-xs text-red-400 flex items-center gap-1 font-medium">
                          <UserX className="w-3.5 h-3.5" /> Inactive
                        </span>
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
