import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, LogOut, LogIn, UserPlus, Package, Heart } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectAuth, logoutThunk, getUserAvatarUrl } from "../../features/auth";
import { selectCartItemCount } from "../../features/cart";
import { Button } from "../ui/Button";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(selectAuth);
  const cartCount = useAppSelector(selectCartItemCount);

  const avatarUrl = getUserAvatarUrl(user);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            IdeaCraft
          </span>
        </Link>

        {/* Center Nav Items */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="text-slate-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-slate-400 hover:text-white transition-colors">
            Products
          </Link>
          <Link to="/categories" className="text-slate-400 hover:text-white transition-colors">
            Categories
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/orders" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                My Orders
              </Link>
              <Link to="/wishlist" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                Wishlist
              </Link>
            </>
          )}
        </nav>

        {/* User / Auth Action Controls */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && (
            <Link to="/cart" className="relative inline-flex items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-slate-300 hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              {cartCount > 0 && (
                <span className="ml-2 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/profile"
                className="flex items-center space-x-2.5 text-sm text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl transition-all"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-linear-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0]?.toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{user.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-rose-400">
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
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
        </div>
      </div>
    </header>
  );
};
