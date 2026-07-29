import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLoginPage } from "../pages/Auth/AdminLoginPage";
import { AdminRegisterPage } from "../pages/Auth/AdminRegisterPage";
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
import { NotFoundPage } from "../pages/NotFound/NotFoundPage";
import { AdminRoute } from "./AdminRoute";
import { GuestRoute } from "./GuestRoute";
import { AdminLayout } from "../components/layout/AdminLayout";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Guest Routes: Login & Register */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/register" element={<AdminRegisterPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/products" element={<AdminProductsPage />} />
          <Route path="/categories" element={<AdminCategoriesPage />} />
          <Route path="/orders" element={<AdminOrdersPage />} />
          <Route path="/customers" element={<AdminCustomersPage />} />
          <Route path="/payments" element={<AdminPaymentsPage />} />
          <Route path="/shipping" element={<AdminShippingPage />} />
          <Route path="/analytics" element={<AdminAnalyticsPage />} />

          {/* Alias support for legacy /admin/* paths */}
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/admin/products" element={<Navigate to="/products" replace />} />
          <Route path="/admin/categories" element={<Navigate to="/categories" replace />} />
          <Route path="/admin/orders" element={<Navigate to="/orders" replace />} />
          <Route path="/admin/customers" element={<Navigate to="/customers" replace />} />
          <Route path="/admin/payments" element={<Navigate to="/payments" replace />} />
          <Route path="/admin/shipping" element={<Navigate to="/shipping" replace />} />
          <Route path="/admin/analytics" element={<Navigate to="/analytics" replace />} />
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
