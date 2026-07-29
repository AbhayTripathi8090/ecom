import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  CreditCard,
  Truck,
  BarChart3,
  ShieldCheck,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectCurrentUser, logoutThunk, getUserAvatarUrl } from "../../features/auth";
import { Button } from "../ui/Button";

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const avatarUrl = getUserAvatarUrl(user);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "Categories", path: "/admin/categories", icon: FolderTree },
    { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { label: "Customers", path: "/admin/customers", icon: Users },
    { label: "Payments", path: "/admin/payments", icon: CreditCard },
    { label: "Shipping", path: "/admin/shipping", icon: Truck },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-xl flex flex-col fixed inset-y-0 z-30">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 justify-between">
          <Link to="/admin/dashboard" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base leading-none">IdeaCraft</span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase mt-0.5">
                Admin Control
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Management Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Badge */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Admin System</p>
              <p className="text-[10px] text-slate-400">Role-Authorized View</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">{user.name}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
