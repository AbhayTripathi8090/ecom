import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  LogOut,
  LogIn,
  UserPlus,
  Package,
  Heart,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectAuth, logoutThunk, getUserAvatarUrl } from "../../features/auth";
import { selectCartItemCount } from "../../features/cart";
import { selectWishlistCount } from "../../features/wishlist";
import { Button } from "../ui/Button";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(selectAuth);
  const cartCount = useAppSelector(selectCartItemCount);
  const wishlistCount = useAppSelector(selectWishlistCount);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarUrl = getUserAvatarUrl(user);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    await dispatch(logoutThunk());
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - Hide text on mobile (< sm), display icon only */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:inline text-xl font-bold bg-linear-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            IdeaCraft
          </span>
        </Link>

        {/* Center Nav Items - Clean & Spaced out */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors hover:text-white ${
              location.pathname === "/" ? "text-indigo-400 font-semibold" : "text-slate-300"
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`transition-colors hover:text-white ${
              location.pathname.startsWith("/products") ? "text-indigo-400 font-semibold" : "text-slate-400"
            }`}
          >
            Products
          </Link>
          <Link
            to="/categories"
            className={`transition-colors hover:text-white ${
              location.pathname.startsWith("/categories") ? "text-indigo-400 font-semibold" : "text-slate-400"
            }`}
          >
            Categories
          </Link>
        </nav>

        {/* Right Action Controls / Profile Menu */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? (
            /* Customer Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-linear-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="font-medium hidden sm:inline">{user.name}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Overview Header */}
                  <div className="px-4 py-3 border-b border-slate-800/80">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate mt-0.5">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>

                  {/* Customer Links */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-indigo-600/10 transition-colors gap-3"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-indigo-600/10 transition-colors gap-3"
                    >
                      <Package className="w-4 h-4 text-indigo-400" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-indigo-600/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/cart"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-indigo-600/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                        <span>My Cart</span>
                      </div>
                      {cartCount > 0 && (
                        <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-slate-800/80 pt-1 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors gap-3 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Overlay Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 text-sm font-medium"
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 text-sm font-medium"
            >
              Categories
            </Link>
          </nav>

          {isAuthenticated && (
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">My Account</p>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 text-sm"
              >
                <UserIcon className="w-4 h-4 text-indigo-400" />
                Profile
              </Link>
              <Link
                to="/orders"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 text-sm"
              >
                <Package className="w-4 h-4 text-indigo-400" />
                Orders
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 text-sm"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-400" />
                  Wishlist
                </div>
                {wishlistCount > 0 && (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 text-sm"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  Cart
                </div>
                {cartCount > 0 && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 text-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

