import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/Home";
import { LoginPage, RegisterPage } from "../pages/Auth";
import { ProfilePage } from "../pages/Profile";
import { CategoryListPage } from "../pages/Category";
import { ProductListPage, ProductDetailPage } from "../pages/Product";
import { NotFoundPage } from "../pages/NotFound";
import { CartPage } from "../pages/Cart";
import { CheckoutPage } from "../pages/Checkout";
import { OrdersPage, OrderDetailPage } from "../pages/Orders";
import { WishlistPage } from "../pages/Wishlist";

import {
  AdminDashboardPage,
  AdminProductsPage,
  AdminCategoriesPage,
  AdminOrdersPage,
  AdminCustomersPage,
  AdminPaymentsPage,
  AdminShippingPage,
  AdminAnalyticsPage,
} from "../pages/Admin";

import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { AdminRoute } from "./AdminRoute";
import { CustomerRoute } from "./CustomerRoute";

import { CustomerLayout } from "../components/layout/CustomerLayout";
import { AdminLayout } from "../components/layout/AdminLayout";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Guest Routes (accessible only when logged out) */}
      <Route element={<GuestRoute />}>
        <Route element={<CustomerLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Admin Routes (Protected by AdminRoute, rendered inside AdminLayout) */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/shipping" element={<AdminShippingPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Route>

      {/* Customer Routes (Protected from Admin access by CustomerRoute) */}
      <Route element={<CustomerRoute />}>
        <Route element={<CustomerLayout />}>
          {/* Public Catalog Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Protected Customer Routes (require customer authentication) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
